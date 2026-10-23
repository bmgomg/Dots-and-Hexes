// Renders Cover.gif and Embed BG.gif, the cover and the embed background animated: the board's game played move
// by move from the empty board (each move's two lines drawn by pencil, closed hexes popping in), a pause on the
// position the still images show, then a fade back to the empty board.
// node itch/cover-gif.mjs   (needs Chrome or Edge, and ffmpeg on the PATH; CHROME=… picks another browser)
//
// As Patch Through's: drives headless Chrome over the DevTools protocol, Cover.html draws each frame
// (window.drawFrame), Chrome photographs it, and ffmpeg turns the frames into a looping GIF.
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CHROME = [
	process.env.CHROME,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium'
].find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
const PORT = 9335;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Cover.html's layouts to animate
const GIFS = [
	{ layout: 'cover', width: 630, height: 500, file: 'Cover.gif' },
	{ layout: 'embed', width: 640, height: 360, file: 'Embed BG.gif' }
];

// Timing, in ms
const FRAME = 40;
const FIRST = 900; // the empty board, before the first move
const DRAW = 360; // a move's two lines, one after the other
const POP = 320; // the hexes a move closes (0.4 s in the game)
const PAUSE = 220; // between moves
const HOLD = 2500; // the position the still images show, before the fade
const FADE = 500;

const steps = (ms) => Math.round(ms / FRAME);

// Frames: [drawFrame's arguments, duration]; closes[i] is how many hexes move i closed
const framesFor = (closes) => {
	const frames = [[{ i: 0 }, FIRST]];

	for (let i = 1; i < closes.length; i++) {
		for (let f = 1; f <= steps(DRAW); f++) frames.push([{ i, grow: f / steps(DRAW), pop: 0 }, FRAME]);
		if (closes[i]) for (let f = 1; f <= steps(POP); f++) frames.push([{ i, pop: f / steps(POP) }, FRAME]);
		frames.at(-1)[1] += i < closes.length - 1 ? PAUSE : HOLD;
	}

	for (let f = 1; f < steps(FADE); f++) frames.push([{ fade: f / steps(FADE) }, FRAME]);

	return frames;
};

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'dots-and-hexes-gif-'));
const chrome = spawn(CHROME, [
	'--headless=new',
	'--disable-gpu',
	'--hide-scrollbars',
	'--mute-audio',
	'--no-first-run',
	'--allow-file-access-from-files',
	`--remote-debugging-port=${PORT}`,
	`--user-data-dir=${path.join(work, 'profile')}`,
	...(process.platform === 'linux' ? ['--no-sandbox'] : []), // Chrome won't start sandboxed as root, as in containers
	'about:blank'
]);

let ws;
let nextId = 1;
const pending = new Map();

const send = (method, params = {}) =>
	new Promise((resolve, reject) => {
		const id = nextId++;
		pending.set(id, { resolve, reject });
		ws.send(JSON.stringify({ id, method, params }));
	});

const evaluate = async (expression) => {
	const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
	if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
	return result.value;
};

try {
	let target;

	for (let i = 0; i < 50 && !target; i++) {
		await sleep(200);
		target = await fetch(`http://127.0.0.1:${PORT}/json/list`)
			.then((r) => r.json())
			.then((l) => l.find((t) => t.type === 'page'))
			.catch(() => null);
	}

	ws = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve) => ws.addEventListener('open', resolve));
	ws.addEventListener('message', (e) => {
		const msg = JSON.parse(e.data);
		const p = pending.get(msg.id);

		if (p) {
			pending.delete(msg.id);
			msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
		}
	});

	await send('Page.enable');

	for (const { layout, width, height, file } of GIFS) {
		await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
		// by way of a blank page: going from #cover to #embed alone only changes the hash, and the layout is set on load
		await send('Page.navigate', { url: 'about:blank' });
		await send('Page.navigate', { url: pathToFileURL(path.join(DIR, 'Cover.html')).href + '#' + layout });
		await sleep(1000);
		await evaluate('document.fonts.ready.then(() => true)');

		const closes = await evaluate('games.map((g) => g.last?.hexes.length ?? 0)');
		const frames = framesFor(closes);
		console.log(`${file}: ${closes.length - 1} moves, ${frames.length} frames`);

		let list = '';

		for (const [i, [args, ms]] of frames.entries()) {
			await evaluate(`drawFrame(${JSON.stringify(args)})`);
			const { data } = await send('Page.captureScreenshot', { format: 'png' });
			const name = `f${String(i).padStart(4, '0')}.png`;
			fs.writeFileSync(path.join(work, name), Buffer.from(data, 'base64'));
			list += `file '${name}'\nduration ${ms / 1000}\n`;
		}

		// the concat demuxer drops the last file's duration unless the file is listed again
		list += `file 'f${String(frames.length - 1).padStart(4, '0')}.png'\n`;
		fs.writeFileSync(path.join(work, 'frames.txt'), list);

		// One palette for the whole GIF, and each frame stores only the rectangle that changed
		execFileSync('ffmpeg', [
			'-y',
			'-loglevel',
			'error',
			'-f',
			'concat',
			'-safe',
			'0',
			'-i',
			path.join(work, 'frames.txt'),
			'-filter_complex',
			'[0:v]split[a][b];[a]palettegen=stats_mode=full[p];[b][p]paletteuse=dither=none:diff_mode=rectangle',
			'-fps_mode',
			'vfr',
			'-loop',
			'0',
			path.join(DIR, file)
		]);
		console.log('wrote', file, Math.round(fs.statSync(path.join(DIR, file)).size / 1024), 'KB');
	}
} finally {
	ws?.close();
	chrome.kill();
	await sleep(500);
	fs.rmSync(work, { recursive: true, force: true, maxRetries: 5 });
}

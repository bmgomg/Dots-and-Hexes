import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';

// the normal build's adapter; for a static build (into build/), switch these two lines and
// uncomment `prerender = true` in src/routes/+layout.js
const adapter = adapterVercel();
// const adapter = adapterStatic();

// Set by scripts/build-itch.js to its output folder: the itch.io build is always static, without a service worker
const itch = process.env.ITCH;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: itch ? adapterStatic({ pages: itch, assets: itch }) : adapter,
		serviceWorker: { register: !itch }
	}
};

export default config;

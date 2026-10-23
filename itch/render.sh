#!/bin/sh
# Renders the itch.io images to PNG with headless Edge (or Chrome): sh itch/render.sh
# (the animated cover and embed background, the GIFs, come from node itch/cover-gif.mjs)
# --allow-file-access-from-files: the pages load board.js and ../src/engine.js as modules from file://
cd "$(dirname "$0")"
BROWSER="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -f "$BROWSER" ] || BROWSER="/c/Program Files/Google/Chrome/Application/chrome.exe"
DIR="$(pwd -W)"
URL="file:///$(echo "$DIR" | sed 's/ /%20/g; s/•/%E2%80%A2/g')"

render() { # page width height scale output
	"$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor="$4" \
		--allow-file-access-from-files --virtual-time-budget=3000 \
		--window-size="$2,$3" --screenshot="$DIR/$5" "$URL/$1" 2>/dev/null
}

render "Cover.html#cover" 630 500 1 "Cover.png"
render "Cover.html#cover" 630 500 2 "Cover-2x.png"
render "Cover.html#embed" 640 360 1 "Embed BG.png"
render rules.html 450 390 1 "Rules.png"
render rules.html 450 390 2 "Rules-2x.png"

# AdShredder by Mojo

A lightweight, no-nonsense Manifest V3 adblocker for Chromium browsers.

I built AdShredder because I got tired of two things: commercial blockers adding "acceptable ads" whitelists and corporate tracking, and YouTube constantly breaking video playback with anti-adblock detection banners. 

Everything runs 100% locally in your browser. No telemetry pings, no account required, and no paid whitelists.

---

## What it actually does

### 1. YouTube video ads & anti-adblock modals
Instead of just aborting network requests (which trips YouTube's detection counter) or just turning up a speed slider (which gets caught by watch-time telemetry), AdShredder runs directly in the page context (`world: "MAIN"`):
- Mutes audio on ad start so you don't hear a sudden burst of audio
- Advances `currentTime` straight to the end and fires the native `ended` DOM event
- Calls YouTube's internal `moviePlayer.skipAd()` function when available
- Auto-clicks skip buttons in a ~60ms loop
- Automatically removes the `ytd-enforcement-message-view-model` modal and unpauses the video if YouTube tries to block the screen

### 2. Cosmetic element collapsing
Standard network blockers often leave behind empty gray boxes or broken layout frames. AdShredder applies targeted CSS rules to collapse ad wrappers and placeholders down to 0px so pages reflow naturally without dead spaces.

### 3. Click-to-hide element picker
If a site has an annoying sticky banner, newsletter overlay, or sponsored widget that filters missed, click **"Shred an Element"** in the popup, point at it, and click. It saves the rule to `chrome.storage.local` so it stays gone whenever you visit that site again.

### 4. Native DeclarativeNetRequest rules
Blocks known ad networks, trackers, and popup redirect networks directly at the browser network layer using native Manifest V3 DNR rulesets.

---

## Browser Support

Works out of the box on all modern Chromium-based browsers:
- Google Chrome
- Brave Browser
- Opera & Opera GX
- Microsoft Edge
- Vivaldi / Arc

---

## Install & Development

### For Users
Install directly with 1 click from the [Chrome Web Store](https://chromewebstore.google.com/detail/adshredder-by-mojo/fhopbflmgfahghekojgpfingpahlmbde).

### Running from source (unpacked)
1. Clone the repo:
   ```bash
   git clone https://github.com/ojjo1805/adshredder.git
   cd adshredder
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project:
   ```bash
   pnpm run build
   ```
4. Load in your browser:
   - Head over to `chrome://extensions/`
   - Turn on **Developer mode** (toggle in the top-right corner)
   - Click **Load unpacked** (Entpackte Erweiterung laden)
   - Select the `./dist` folder inside this directory

---

## Support & Donations

AdShredder is completely free and open source. If it saves your sanity while browsing and you want to support independent development:

- ☕ **Ko-fi:** [https://ko-fi.com/mojo1805](https://ko-fi.com/mojo1805)
- 💎 **Crypto Portal:** [https://nowpayments.io/donation/adshredder_mojo](https://nowpayments.io/donation/adshredder_mojo)

Direct Wallets:
- **BTC:** `bc1qcudwfqpsjqlrwqrn8qrmuyl2tg4nmcnyv27nx4`
- **ETH:** `0x0daCbcc3B449e3bD7f49ED64F85C16a271fA7f06`
- **SOL:** `AAY9oCC2rKKzofpJvPw2ocnqJPTg26AMaBhDTqxJE3F3`
- **DOGE:** `DDwXee7WVSwDayUqe7x3PN5nXeuKMyDj3p`

---

## License
MIT License. If you run into a broken site or layout glitch, feel free to open an issue or PR!

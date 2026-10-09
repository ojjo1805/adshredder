# ⚡ AdShredder by Mojo

> **Ultra-fast ad, popup and video ad shredder with an interactive element picker, zero bloat and 100% privacy.**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-06b6d4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-ff5e5b?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/mojo1805)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

---

## 🎯 Why AdShredder?

The modern web has become bloated with intrusive ads, video interruptions, aggressive popunders, and corporate adblockers that sell your data or whitelist ads for profit.

**AdShredder by Mojo** was built with one goal: **Reclaim a clean, fast, and peaceful internet without compromises.**

* **0% Telemetry & 0% Tracking:** Everything runs 100% locally in your browser. No external servers, no tracking pings.
* **No "Acceptable Ads" Deals:** No advertiser can pay to bypass our filters.
* **YouTube Video Ad Annihilator:** Fast-forwards ads at 64x speed and automatically skips interruptions seamlessly without triggering anti-adblock bans.
* **Universal Element Collapsing:** Dead ad boxes, gray placeholder frames, and "ADVERTISEMENT" labels are collapsed to 0px so pages reflow naturally.
* **Interactive Visual Element Picker:** Point and click on any annoying web element to permanently vaporize it from your screen.

---

## 🚀 Key Features

### 1. 🎬 Video Ad Annihilator
Runs directly in the page's execution context (`world: "MAIN"`):
* Fast-forwards unavoidable video ads at 64x playback rate.
* Auto-skips skip buttons within 60ms.
* Defuses YouTube anti-adblock warning modals in real time.

### 2. 📐 Universal Element Collapsing
Eradicates the gaping gray holes and "ADVERTISEMENT" placeholders left behind by network-blocked ads. Fully tuned for major media publishers (Fandom, CBS, TVGuide, TVSpielfilm, News blogs).

### 3. ✂️ Visual Element Picker
Built using a closed Shadow DOM overlay in Electric Teal styling:
* Real-time hover inspection with z-index elevation.
* Immediate inline suppression and persistent saving to `chrome.storage.local`.

### 4. ⚡ Native Manifest V3 DeclarativeNetRequest
197+ high-impact global rules blocking advertising, tracking, gaming overlays (Agar.io, Playwire, Freestar), and regional networks (Baidu, Yandex, Daum AdFit, Speakol, Yektanet, Columbia) at the browser's C++ network level.

---

## 🛠️ Installation & Development

### For Users
Install directly with 1 click from the [Chrome Web Store](https://chrome.google.com/webstore) *(link coming soon)*.

### For Developers (Manual / Unpacked)
1. Clone this repository:
   ```bash
   git clone https://github.com/ojjo1805/adshredder.git
   cd adshredder
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm run build
   ```
4. In Chrome, navigate to `chrome://extensions/`:
   * Enable **Developer mode** (top right toggle).
   * Click **Load unpacked** (Entpackte Erweiterung laden).
   * Select the `./dist` folder inside this repository.

---

## ☕ Support Independent Development

AdShredder by Mojo is completely free, open-source, and independent. If it saves your time and sanity, you can support development here:

* ☕ **Ko-fi:** [https://ko-fi.com/mojo1805](https://ko-fi.com/mojo1805) *(Card, PayPal, Apple Pay, Google Pay)*
* 💎 **Crypto Portal (300+ Coins):** [https://nowpayments.io/donation/adshredder_mojo](https://nowpayments.io/donation/adshredder_mojo) *(DOGE, BTC, ETH & more)*

### Direct Wallets
* **Bitcoin (BTC):** `bc1qcudwfqpsjqlrwqrn8qrmuyl2tg4nmcnyv27nx4`
* **Ethereum (ETH / USDT):** `0x0daCbcc3B449e3bD7f49ED64F85C16a271fA7f06`
* **Solana (SOL):** `AAY9oCC2rKKzofpJvPw2ocnqJPTg26AMaBhDTqxJE3F3`
* **Dogecoin (DOGE):** `DDwXee7WVSwDayUqe7x3PN5nXeuKMyDj3p`

---

## 📄 Privacy Policy & License
* Read our [Privacy Policy](PRIVACY_POLICY.md) (100% Zero Data Collection Guarantee).
* Released under the [MIT License](LICENSE).

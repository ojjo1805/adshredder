# Chrome Web Store Listing - AdShredder by Mojo

Use these pre-crafted details when creating your new item in the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devcenter).

---

## 1. Store Metadata

* **Extension Name:**  
  `AdShredder by Mojo`

* **Short Description (max 132 characters):**  
  `Ultra-fast ad, popup and video ad shredder with an element picker, zero bloat and 100% privacy.`

* **Category:**  
  `Productivity` (or `Workflow & Planning` / `Search Tools`)

* **Privacy Policy URL:**  
  `https://github.com/ojjo1805/adshredder/blob/main/PRIVACY_POLICY.md`

* **Support / Website URL:**  
  `https://github.com/ojjo1805/adshredder`

---

## 2. Detailed Store Description (Copy & Paste)

```markdown
Reclaim a clean, fast, and peaceful internet with AdShredder by Mojo.

Built from the ground up for Chrome Manifest V3, AdShredder is a modern, ultra-lightweight ad and popup shredder with a radical commitment to speed, documentation integrity, and true zero-telemetry privacy.

⚡ KEY HIGHLIGHTS:

• 🎬 Seamless Video Ad Annihilator:
Tired of disruptive video ads and annoying anti-adblock modals? AdShredder's intelligent defuser fast-forwards ads at 64x speed and automatically skips interruptions seamlessly.

• 🛡️ Zero Bloat & Zero Telemetry:
Unlike commercial adblockers, AdShredder has NO corporate investors, NO data-mining SDKs, and NO paid "Acceptable Ads" backdoor deals. 100% of blocking happens locally inside your browser. Zero outgoing telemetry.

• ✂️ Interactive Visual Element Picker:
Spot an annoying newsletter banner, sticky header, or sponsored widget? Click "Shred an Element", point, click, and permanently vaporize it from your screen.

• 📐 Universal Element Collapsing:
No more dead white spaces or gray placeholder frames! AdShredder collapses ad containers down to 0 pixels so pages reflow naturally like a clean magazine.

• 🚀 Native Manifest V3 Performance:
Powered by Chrome's native DeclarativeNetRequest engine. Consumes virtually zero CPU or memory footprint, keeping your laptop battery lasting longer and pages loading instantly.

• 🚩 One-Click Broken Site Reporter:
Found a website with an ad slipping through or a layout issue? Report it with 1 click directly to our open-source GitHub issues or via Ko-fi so we can patch it promptly.

---

🔒 PRIVACY PROMISE:
• 0% Tracking
• 0% Data Collection
• 0% Ads Whitelisted for Pay
• 100% Open Source & Community-driven

Created with passion by Mojo.
Support independent development: https://ko-fi.com/mojo1805
```

---

## 3. Chrome Web Store Privacy Questionnaire (Antworten für Google)

When Google asks the Privacy & Permissions questionnaire in the developer dashboard:

* **Single Purpose Description:**  
  `AdShredder blocks intrusive advertisements, video ads, popups, and trackers locally to provide a cleaner and faster browsing experience.`

* **Permission Justifications:**
  * `declarativeNetRequest`: To block network requests to known advertisement and tracking domains locally using Chrome's native engine.
  * `storage`: To save user preferences (whitelisted sites, custom element picker rules) locally on the device.
  * `activeTab`: To inspect the current tab's hostname when the user opens the popup.
  * `<all_urls>` (Host permissions): Required to apply local cosmetic hiding stylesheets and video ad defusing scripts across websites visited by the user.

* **Data Usage Declaration:**
  * Do you collect user data? ➔ **NO (None / None collected)**.
  * Check the certification box confirming that this extension does not sell, transfer, or use user data for unrelated purposes.

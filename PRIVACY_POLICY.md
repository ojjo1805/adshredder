# Privacy Policy for AdShredder by Mojo

**Last updated: October 10, 2026**

AdShredder by Mojo is built upon a fundamental principle: **Your browser is your private space.**

This privacy policy explains how AdShredder by Mojo ("the extension") treats user information.

---

## 1. Zero Data Collection & Zero Telemetry
* **No Personal Data:** AdShredder does not collect, record, log, or transmit any personal information, identity, browsing history, search queries, IP addresses, or cookies.
* **No Telemetry / Analytics:** The extension contains zero tracking scripts, zero third-party analytics SDKs (no Google Analytics, no Mixpanel, etc.), and zero background ping services.
* **No Remote Communication:** All ad-blocking decisions, popup defusing, and cosmetic element shredding happen **100% locally on your computer** within your browser engine. The extension has zero external backend servers.

---

## 2. Permissions & Why They Are Required
AdShredder by Mojo operates under Google Chrome Manifest V3 and requests only the minimal permissions required for ad blocking:

* `declarativeNetRequest`: Used exclusively to block network requests to known advertisement, tracking, and telemetry servers locally on your device via Chrome's native privacy-preserving engine.
* `storage`: Used solely to store your local preferences (such as your domain whitelist, master on/off switch, and your custom element picker rules) locally in `chrome.storage.local`. This data never leaves your device.
* `activeTab`: Used solely when you click the extension popup to detect the current website hostname for whitelisting and statistics.
* `<all_urls>` host permissions: Necessary to inject local cosmetic CSS stylesheets and the popup defuser script into web pages to remove video ads, blank placeholder boxes, and popunders.

---

## 3. Data Sharing & Third Parties
* **Zero Commercial Partnerships:** We do not participate in "Acceptable Ads" programs. We do not sell ad whitelists.
* **Zero Third-Party Data Sharing:** Because we do not collect any data, there is literally nothing to sell, share, or monetize.

---

## 4. User-Initiated External Links
The extension provides voluntary, user-initiated links for supporters:
* **Ko-fi** (`ko-fi.com/mojo1805`): Opens in a new tab if you voluntarily choose to support independent development.
* **NOWPayments** (`nowpayments.io/donation/adshredder_mojo`): Opens in a new tab if you voluntarily choose to tip with cryptocurrency.
* **GitHub Issues**: Opens in a new tab if you voluntarily report a broken website.

These services operate under their own privacy policies upon opening in your browser.

---

## 5. Contact & Open Source Verification
The complete source code of AdShredder by Mojo is open and verifiable by the community:
* **GitHub:** [https://github.com/ojjo1805/adshredder](https://github.com/ojjo1805/adshredder)
* **Creator:** Mojo
* **Support:** [https://ko-fi.com/mojo1805](https://ko-fi.com/mojo1805)

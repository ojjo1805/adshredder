/**
 * AdShredder by Mojo - Cosmetic Engine & Isolated Content Script
 * Manages element hiding (both built-in and user-custom),
 * communicates with background service worker, and coordinates the visual Element Picker.
 */

import { ElementPicker } from './element_picker';

export const BUILTIN_COSMETIC_RULES: string[] = [
  // 1. YouTube Ads
  'ytd-ad-slot-renderer',
  'ytd-in-feed-ad-layout-renderer',
  'ytd-banner-promo-renderer',
  '#masthead-ad',
  'ytd-promoted-sparkles-web-renderer',
  'ytd-player-legacy-desktop-watch-ads-renderer',
  'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
  '.ytp-ad-overlay-container',
  '.ytp-ad-image-overlay',
  '.ytp-ad-message-container',
  '#player-ads',
  'ytd-statement-banner-renderer',
  '.video-ads.ytp-ad-module',
  'ytd-enforcement-message-view-model',

  // 2. Agar.io & Web Games Ads
  '[id^="agar-io_"]',
  '[class*="agar-io_"]',
  '[id*="agar-io_"]',
  '#openfl-overlay-top',
  '#preroll',
  '#debug-overlay',
  '#ad-bottom',
  '#advertisement',
  '#ad-banner',
  '#mainui-ads',
  '.agar-ads',
  '[id*="skyscraper"]',
  '[class*="ad-skyscraper"]',
  '[class*="desktop_skyscraper"]',
  '.js-ad-desktop-skyscraper',
  '[id^="aip_"]',
  '[class^="aip_"]',
  '[id^="playwire_"]',
  '[id^="freestar_"]',
  '[id^="nitropay_"]',
  '[id^="seedtag_"]',

  // 3. Generic Ad Slots & Networks
  'ins.adsbygoogle',
  '[id^="google_ads_"]',
  '[id^="div-gpt-ad-"]',
  '[id^="ad-slot-"]',
  '[id^="ad_slot_"]',
  '[id^="banner-ad-"]',
  '[id*="amazon-ad"]',
  '[id^="amzn-native-"]',
  '[id^="amzn_assoc_"]',
  '.aax_outer',
  '[class*="sponsored-post"]',
  '[class*="promoted-content"]',
  '.ad-banner',
  '.advertisement',
  '.adsbygoogle',
  '[data-ad-slot]',
  '[data-ad-unit]',
  '[data-dfp-id]',
  '[data-google-query-id]',
  '[data-ad-client]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="googlesyndication.com"]',
  'iframe[src*="adnxs.com"]',
  'iframe[src*="criteo.com"]',
  'iframe[src*="popads.net"]',
  'iframe[src*="exoclick.com"]',
  'iframe[src*="amazon-adsystem.com"]',

  // 4. International Regional Ads
  '[id^="BAIDU_SSP_"]',
  '[id^="cpro_"]',
  '[class*="baidu-ad"]',
  '[id*="tanx-"]',
  '.yads_banner',
  '[id^="ad-yahoo"]',
  '[class*="microad"]',
  '.sp-banner',
  '[id*="geniee"]',
  '[id^="adfit_"]',
  '[class*="adfit"]',
  '[id^="naver_ad"]',
  '.dable-widget',
  '[id*="dable"]',
  '[id^="yandex_ad_"]',
  '[id^="yandex_rtb_"]',
  '[class*="yandex-adaptive"]',
  '[class*="speakol"]',
  '[id*="speakol"]',
  '[class*="jubna"]',
  '[id*="jubna"]',
  '[class*="yektanet"]',
  '[id*="yektanet"]',
  '[class*="sabavision"]',
  '[id*="sabavision"]',
  '[class*="mediaad"]',
  '[id^="clmb_"]',
  '.clmb-ad-widget',

  // 5. Native Recommendation Widgets
  '[id^="taboola-"]',
  '[class*="taboola"]',
  '.tbl-feed-container',
  '.trc_related_container',
  '[id^="outbrain_"]',
  '[class*="OUTBRAIN"]',
  '[class*="outbrain"]',
  '.ob-widget',
  '[id^="rc-widget-"]',
  '[class*="revcontent"]',
  '.rc-container',
  '[id^="MarketGid"]',
  '[class*="mgid-"]',
  '[id^="ntv-"]',
  '[class*="nativo-"]',
  '[id^="contentad"]',
  '[class*="contentad"]',
  '[id^="plista_"]',
  '[class*="plista_"]',
  '[id^="zergnet-widget"]',

  // 6. Element Collapsing (Targeted Wrappers & Frames)
  '[class*="ad-wrapper"]',
  '[class*="ad_wrapper"]',
  '[class*="ad-holder"]',
  '[class*="ad_holder"]',
  '[class*="ad-placeholder"]',
  '[class*="ad_placeholder"]',
  '[class*="ad-container"]',
  '[class*="ad_container"]',
  '[class*="ad-slot"]',
  '[class*="ad_slot"]',
  '[class*="ad-box"]',
  '[class*="ad_box"]',
  '[class*="ad-module"]',
  '[class*="ad-placement"]',
  '[class*="ad-region"]',
  '[class*="ad-rail"]',
  '[class*="ad-unit"]',
  '[class*="ad_unit"]',
  '[class*="ad-banner"]',
  '[class*="ad_banner"]',
  '[class*="ad-frame"]',
  '[class*="ad_frame"]',
  '[class*="ad-spot"]',
  '[class*="ad_spot"]',
  '[class*="advertisement-wrapper"]',
  '[class*="advertisement_wrapper"]',
  '[class*="advertisement-placeholder"]',
  '[class*="advertisement-container"]',
  '[class*="advertisement-holder"]',
  '[class*="advertisement-box"]',
  '[class*="advertisement-slot"]',

  // Publisher / Fandom / CBS / TVGuide specific
  'fandom-ad',
  '[class*="fandom-ad-wrapper"]',
  '[class*="fandom-ad-placeholder"]',
  '[class*="fandom-ad-label"]',
  '[class*="fandom-ad-sticky-container"]',
  '[class*="fandom-ad-rail-wrapper"]',
  '[data-ad-slot-id]',
  '.top-ads-container',
  '.c-adDisplay',
  '.c-adDisplay_wrapper',
  '.c-adDisplay_label',
  '[data-component="adDisplay"]',
  '[class*="adDisplay"]',

  // Sticky & Floating
  '[class*="sticky-ad"]',
  '[class*="sticky_ad"]',
  '[id*="sticky-ad"]',
  '[id*="sticky_ad"]',
  '[class*="floating-ad"]',
  '[class*="floating_ad"]',
  '[id*="floating-ad"]',
  '[class*="adhesive-ad"]',
  '[class*="anchor-ad"]',
  '[class*="bottom-ad"]',
  '[class*="top-ad-bar"]',
  '[class*="corner-ad"]',

  // Video Outstream
  '[class*="outstream-ad"]',
  '[class*="outstream_ad"]',
  '[id*="outstream"]',
  '.primis-player-container',
  '[class*="vpaid-ad"]',
  '[class*="ad-player-container"]',

  // 7. Multi-Lingual Element Collapsing
  '[class*="werbung-"]',
  '[class*="-werbung"]',
  '[class*="werbebanner"]',
  '[class*="werbecontainer"]',
  '[class*="werbeflaeche"]',
  '[class*="werbeplatz"]',
  '[class*="werbehinweis"]',
  '[class*="anzeige-"]',
  '[class*="-anzeige"]',
  '[class*="anzeigen-wrapper"]',
  '[class*="anzeigen-container"]',
  '[class*="gesponsert-"]',
  '[id*="werbung"]',
  '[id*="anzeige"]',
  '[class*="publicite-"]',
  '[class*="-publicite"]',
  '[class*="publicitaire"]',
  '[class*="encart-pub"]',
  '[class*="zone-pub"]',
  '[class*="banniere-pub"]',
  '[class*="publicidad-"]',
  '[class*="-publicidad"]',
  '[class*="espacio-publicitario"]',
  '[class*="anuncio-"]',
  '[class*="patrocinado-"]',
  '[class*="reklama-"]',
  '[class*="-reklama"]',
  '[class*="reklamny"]',
  '[id*="reklama"]',

  // 8. Ad Labels & Captions
  '[class*="ad-label"]',
  '[class*="ad_label"]',
  '[class*="ad-caption"]',
  '[class*="ad-disclaimer"]',
  '[class*="ad-header"]',
  '[class*="ad-title"]',
  '[class*="ad-text"]',
  '[class*="ad-notice"]',
  '[class*="advertisement-label"]',
  '[class*="advertisement-header"]',
  '[class*="advertisement-title"]',
  '[class*="advertisement-caption"]',
  '.ad-label',
  '.ad-disclaimer',
  '[class*="sponsored-label"]',
  '[class*="promoted-label"]',
  '[class*="anzeige-label"]',
  '[class*="werbung-label"]',
  '[class*="werbehinweis"]',
  '[aria-label="advertisement" i]',
  '[aria-label="advert" i]',
  '[aria-label="anzeige" i]',
  '[aria-label="werbung" i]',
  '[aria-label="gesponsert" i]',
  '[aria-label="sponsored" i]',
  '[aria-label="publicité" i]',
  '[aria-label="publicidad" i]',
  '[aria-label="реклама" i]',
  'shreddit-ad-post',
  '[data-testid="ad-post"]',
  '[data-ad-click]'
];

(function () {
  const hostname = window.location.hostname;
  let customSelectors: string[] = [];
  let pickerInstance: ElementPicker | null = null;
  let styleTag: HTMLStyleElement | null = null;

  // 1. Setup Cosmetic Style Injection
  function ensureStyleTag(): HTMLStyleElement {
    if (!styleTag || !document.contains(styleTag)) {
      styleTag = document.getElementById('adshredder-cosmetic-styles') as HTMLStyleElement;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'adshredder-cosmetic-styles';
        (document.head || document.documentElement).appendChild(styleTag);
      }
    }
    return styleTag;
  }

  function applyCosmeticRules() {
    const allSelectors = [...BUILTIN_COSMETIC_RULES, ...customSelectors];
    if (allSelectors.length === 0) {
      if (styleTag) styleTag.textContent = '';
      return;
    }
    const tag = ensureStyleTag();
    const cssRule = `:root:not([data-adshredder-off]) :is(\n${allSelectors.join(',\n')}\n) {\n  display: none !important;\n  visibility: hidden !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  max-height: 0 !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  line-height: 0 !important;\n  overflow: hidden !important;\n}\n`;
    tag.textContent = cssRule;
  }

  function updateActiveState(masterEnabled: boolean, isWhitelisted: boolean) {
    if (masterEnabled === false || isWhitelisted === true) {
      document.documentElement.setAttribute('data-adshredder-off', 'true');
      if (styleTag) styleTag.textContent = '';
    } else {
      document.documentElement.removeAttribute('data-adshredder-off');
      applyCosmeticRules();
    }
  }

  // Load saved rules for this domain
  const storageKey = `custom_rules_${hostname}`;
  chrome.storage.local.get([storageKey, 'master_enabled', `whitelist_${hostname}`], (result) => {
    const masterEnabled = result.master_enabled ?? true;
    const isWhitelisted = result[`whitelist_${hostname}`] === true;

    if (result[storageKey] && Array.isArray(result[storageKey])) {
      customSelectors = result[storageKey];
    }
    updateActiveState(masterEnabled, isWhitelisted);
  });

  // Listen to live toggles from popup in real-time across all tabs
  chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(['master_enabled', `whitelist_${hostname}`], (res) => {
      const master = res.master_enabled ?? true;
      const whitelisted = res[`whitelist_${hostname}`] === true;
      updateActiveState(master, whitelisted);
    });
  });

  // Re-apply styles on DOM ready and continuously via MutationObserver
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCosmeticRules);
  } else {
    applyCosmeticRules();
  }

  // Ensure style tag stays attached even if dynamic page wipes head
  const observer = new MutationObserver(() => {
    if (!document.documentElement.hasAttribute('data-adshredder-off')) {
      if (!document.getElementById('adshredder-cosmetic-styles')) {
        applyCosmeticRules();
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 2. Listen to Popup Defuser Events from MAIN world
  window.addEventListener('__ADSHREDDER_POPUP_BLOCKED__', (e: Event) => {
    const customEvent = e as CustomEvent;
    const detail = customEvent.detail || {};
    
    chrome.runtime.sendMessage({
      type: 'POPUP_BLOCKED_STAT',
      hostname,
      detail
    }).catch(() => {});
  });

  // 3. Handle Element Picker Callback
  function handleRuleCreated(selector: string) {
    if (!customSelectors.includes(selector)) {
      customSelectors.push(selector);
      applyCosmeticRules();

      // Save to chrome.storage.local
      chrome.storage.local.set({ [storageKey]: customSelectors }, () => {
        console.log(`[AdShredder by Mojo] ✂️ Saved custom shred rule for ${hostname}:`, selector);
        
        // Notify background service worker
        chrome.runtime.sendMessage({
          type: 'ELEMENT_SHREDDED_STAT',
          hostname,
          selector
        }).catch(() => {});
      });
    }
  }

  // 4. Runtime Message Listener (from Popup UI)
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'START_ELEMENT_PICKER') {
      if (!pickerInstance) {
        pickerInstance = new ElementPicker(handleRuleCreated);
      }
      pickerInstance.start();
      sendResponse({ success: true });
      return true;
    }

    if (message.type === 'STOP_ELEMENT_PICKER') {
      pickerInstance?.stop();
      sendResponse({ success: true });
      return true;
    }

    if (message.type === 'GET_PAGE_STATS') {
      let hiddenCount = 0;
      if (customSelectors.length > 0) {
        try {
          hiddenCount = document.querySelectorAll(customSelectors.join(', ')).length;
        } catch {
          hiddenCount = customSelectors.length;
        }
      }
      sendResponse({
        hostname,
        customRuleCount: customSelectors.length,
        hiddenElementCount: hiddenCount,
        customSelectors
      });
      return true;
    }

    if (message.type === 'CLEAR_DOMAIN_RULES') {
      customSelectors = [];
      applyCosmeticRules();
      chrome.storage.local.remove(storageKey, () => {
        sendResponse({ success: true });
      });
      return true;
    }
  });
})();

/**
 * AdShredder - Cosmetic Engine
 * Injects CSS rules to collapse ad wrappers and manages custom element picker rules.
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
  '[id*="ad-skyscraper"]',
  '[id*="banner-skyscraper"]',
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

  // 4. International Regional Ad Networks (Worldwide: CN, JP, KR, MENA, IR, IN, PK, SG, VN, TR, Eastern Europe)
  // China (Baidu, Alibaba Alimama/Tanx, Tencent, Sogou)
  '[id^="BAIDU_SSP_"]',
  '[id^="cpro_"]',
  '[class*="baidu-ad"]',
  '[id^="tanx-"]',
  '[id^="alimama_"]',
  '[class^="alimama-"]',
  '[id^="tencent_ad_"]',
  '[class^="tencent-ad-"]',
  '[id^="sogou_"]',

  // Japan & Korea (Yahoo Japan, MicroAd, Kakao AdFit, Naver, Dable)
  '.yads_banner',
  '[id^="ad-yahoo"]',
  '[class*="microad"]',
  '.sp-ad-banner',
  '.sp_ad_banner',
  '[id^="geniee-"]',
  '[id^="geniee_"]',
  '[id^="adfit_"]',
  '[class*="adfit"]',
  '[id^="naver_ad"]',
  '.dable-widget',
  '[id^="dable-"]',
  '[id^="dable_"]',

  // Arabic / MENA (Speakol, Jubna, Hasoub, Mawdoo3)
  '[class^="speakol-"]',
  '[id^="speakol-"]',
  '[class^="jubna-"]',
  '[id^="jubna-"]',
  '[id^="hasoub_"]',
  '[class^="hasoub-"]',
  '[class^="mawdoo3-ad-"]',

  // Persian / Iran (Yektanet, SabaVision, MediaAd, Kaprila, Tapsell)
  '[class^="yektanet-"]',
  '[id^="yektanet-"]',
  '[class^="sabavision-"]',
  '[id^="sabavision-"]',
  '[class^="mediaad-"]',
  '[id^="mediaad-"]',
  '[id^="kaprila-"]',
  '[class^="kaprila-"]',
  '[class^="tapsell-ad-"]',
  '[id^="tapsell-"]',

  // India, Pakistan & Urdu (Times Colombia, InMobi, Media.net, SVG Media)
  '[id^="clmb_"]',
  '.clmb-ad-widget',
  '[id^="colombia_"]',
  '[id^="svg_ad_"]',
  '[class^="inmobi-ad-"]',
  '[id^="inmobi-"]',
  '[id^="medianet_"]',
  '[class^="medianet-ad"]',

  // Singapore & Southeast Asia (Innity, InSkin, AnyMind/AdAsia)
  '[id^="innity_"]',
  '[class^="innity-"]',
  '[class^="inskin-"]',
  '[id^="inskin-"]',
  '[class^="adasia-"]',
  '[id^="adasia-"]',

  // Vietnam (Admicro, eClick, Ambient, VietAd)
  '[id^="adm_"]',
  '[class^="admicro-"]',
  '[id^="eclick_"]',
  '[class^="eclick-"]',
  '[id^="ambient_ad_"]',
  '[class^="vietad-"]',

  // Turkey (Reklamport, GelirOrtakları, Hürriyet Ad)
  '[id^="reklamport_"]',
  '[class^="reklamport-"]',
  '[id^="hurriyet_ad_"]',
  '.reklam-alani',
  '.reklam-kutusu',
  '.reklam-banner',
  '[class^="reklam-alani"]',

  // Eastern Europe: Poland, Czech, Hungary, Romania, Russia (Yandex, Onet, WP, Seznam/Sklik, Indamail)
  '[id^="yandex_ad_"]',
  '[id^="yandex_rtb_"]',
  '[class*="yandex-adaptive"]',
  '[id^="onet-ad-"]',
  '[class^="onet-ad-"]',
  '.reklama-onet',
  '[id^="wp-ad-"]',
  '[class^="wp-ad-"]',
  '.reklama-wp',
  '.reklamowy-boks',
  '[id^="sklik_"]',
  '[class^="sklik-"]',
  '[id^="seznam_ad_"]',
  '[id^="inda_ad_"]',
  '.reklam-doboz',
  '.reklam-sav',
  '.reclama-banner',
  '.reclama-box',
  '[id^="reclama-"]',

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

  // 6. Element Collapsing (Targeted Wrappers & Frames - strict class tokens to prevent substring collisions like thread-container)
  '.ad-wrapper',
  '.ad_wrapper',
  '.ad-holder',
  '.ad_holder',
  '.ad-placeholder',
  '.ad_placeholder',
  '.ad-container',
  '.ad_container',
  '.ad-slot',
  '.ad_slot',
  '.ad-box',
  '.ad_box',
  '.ad-module',
  '.ad-placement',
  '.ad-region',
  '.ad-rail',
  '.ad-unit',
  '.ad_unit',
  '.ad-banner',
  '.ad_banner',
  '.ad-frame',
  '.ad_frame',
  '.ad-spot',
  '.ad_spot',
  '.advertisement-wrapper',
  '.advertisement_wrapper',
  '.advertisement-placeholder',
  '.advertisement-container',
  '.advertisement-holder',
  '.advertisement-box',
  '.advertisement-slot',
  '[class^="ad-wrapper-"]',
  '[class^="ad-container-"]',
  '[class^="ad-slot-"]',
  '[class^="ad-banner-"]',
  '[class^="ad-box-"]',

  // Publisher / Fandom / CBS / TVGuide specific
  'fandom-ad',
  '.fandom-ad-wrapper',
  '.fandom-ad-placeholder',
  '.fandom-ad-label',
  '.fandom-ad-sticky-container',
  '.fandom-ad-rail-wrapper',
  '[data-ad-slot-id]',
  '.top-ads-container',
  '.c-adDisplay',
  '.c-adDisplay_wrapper',
  '.c-adDisplay_label',
  '[data-component="adDisplay"]',

  // Sticky & Floating
  '.sticky-ad',
  '.sticky_ad',
  '[id^="sticky-ad"]',
  '[id^="sticky_ad"]',
  '.floating-ad',
  '.floating_ad',
  '[id^="floating-ad"]',
  '.adhesive-ad',
  '.anchor-ad',
  '.bottom-ad',
  '.top-ad-bar',
  '.corner-ad',

  // Video Outstream
  '.outstream-ad',
  '.outstream_ad',
  '[id^="outstream-ad"]',
  '.primis-player-container',
  '.vpaid-ad',
  '.ad-player-container',

  // 7. Multi-Lingual Element Collapsing: German, French, Spanish, Russian
  // German (Werbung, Werbebanner, Gesponsert - strictly qualified to prevent breaking listings/jobs/justice portals)
  '.werbebanner',
  '.werbecontainer',
  '.werbeflaeche',
  '.werbeplatz',
  '.werbehinweis',
  '.werbeblock',
  '.werbe-box',
  '.werbung-box',
  '.ad-werbung',
  '.werbeanzeige',
  '.ad-anzeige',
  '.anzeigen-wrapper',
  '.anzeigen-container',
  '[class^="werbe-"]',
  '[class^="werbung-"]',
  '[id^="werbebanner"]',
  '[id^="werbecontainer"]',
  '[id^="ad-anzeige"]',
  '[id^="werbeanzeige"]',
  '.gesponsert-post',
  '[class^="gesponsert-"]',

  // French (Publicité, Sponsorisé - strictly qualified for ad units)
  '.publicite-banner',
  '.publicite-box',
  '.banniere-publicitaire',
  '.encart-publicitaire',
  '.espace-publicitaire',
  '.publicite-native',
  '.encart-pub',
  '.zone-pub',
  '.banniere-pub',
  '[class^="publicite-banner"]',
  '[class^="publicite-box"]',

  // Spanish / Portuguese (Publicidad, Patrocinado, Anuncio - protects announcements and notices)
  '.publicidad-banner',
  '.publicidad-box',
  '.bloque-publicidad',
  '.contenedor-publicidad',
  '.espacio-publicitario',
  '.anuncio-box',
  '.anuncio-banner',
  '.anuncio-patrocinado',
  '[class^="publicidad-banner"]',
  '[class^="publicidad-box"]',
  '[class^="anuncio-banner"]',

  // Russian / Cyrillic (Реклама)
  '.reklama-banner',
  '.reklama-box',
  '.reklamny-blok',
  '.reklamny-banner',
  '[id^="reklama-banner"]',
  '[id^="reklama-box"]',
  '[class^="reklama-banner"]',
  '[class^="reklama-box"]',

  // 8. Ad Labels & Captions
  '.ad-label',
  '.ad_label',
  '.ad-disclaimer',
  '.advertisement-label',
  '.advertisement-header',
  '.advertisement-title',
  '.advertisement-caption',
  '.sponsored-label',
  '.promoted-label',
  '.werbung-label',
  '.werbehinweis',
  '[class^="ad-label-"]',
  '[class^="advertisement-label"]',

  // Accessibility ARIA Labels for Ads
  '[aria-label="advertisement" i]',
  '[aria-label="advert" i]',
  '[aria-label="werbung" i]',
  '[aria-label="gesponsert" i]',
  '[aria-label="sponsored" i]',
  '[aria-label="publicité" i]',
  '[aria-label="publicidad" i]',
  '[aria-label="реклама" i]',
  // Reddit promoted posts and comment thread ads (Fix for Issue #1)
  'shreddit-ad-post',
  'shreddit-comments-page-ad',
  '.shreddit-comments-page-ad',
  'template-loader[name="comments-page-ad"]',
  'shreddit-post[adv]',
  '.ad-format-container',
  '.ad-format-content',
  '.promotedlink',
  '[data-testid="ad-post"]',
  '[data-ad-click]',
  '[data-ad-click-location]',
  '[data-ad-click-action]',
  '[data-ad-event]'
];

(function () {
  const hostname = window.location.hostname;
  let customSelectors: string[] = [];
  let pickerInstance: ElementPicker | null = null;
  let styleTag: HTMLStyleElement | null = null;

  // Dedicated style tag for CSS rules
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

  // Load saved custom rules for this domain
  const storageKey = `custom_rules_${hostname}`;
  chrome.storage.local.get([storageKey, 'master_enabled', `whitelist_${hostname}`], (result) => {
    const masterEnabled = result.master_enabled ?? true;
    const isWhitelisted = result[`whitelist_${hostname}`] === true;

    if (result[storageKey] && Array.isArray(result[storageKey])) {
      customSelectors = result[storageKey];
    }
    updateActiveState(masterEnabled, isWhitelisted);
  });

  // Listen to live toggles from popup across all open tabs
  chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(['master_enabled', `whitelist_${hostname}`], (res) => {
      const master = res.master_enabled ?? true;
      const whitelisted = res[`whitelist_${hostname}`] === true;
      updateActiveState(master, whitelisted);
    });
  });

  // Re-apply styles on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCosmeticRules);
  } else {
    applyCosmeticRules();
  }

  // Keep style tag attached if dynamic SPAs wipe head
  const observer = new MutationObserver(() => {
    if (!document.documentElement.hasAttribute('data-adshredder-off')) {
      if (!document.getElementById('adshredder-cosmetic-styles')) {
        applyCosmeticRules();
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Relay blocked popup event from main world
  window.addEventListener('__ADSHREDDER_POPUP_BLOCKED__', (e: Event) => {
    const customEvent = e as CustomEvent;
    const detail = customEvent.detail || {};
    
    chrome.runtime.sendMessage({
      type: 'POPUP_BLOCKED_STAT',
      hostname,
      detail
    }).catch(() => {});
  });

  // Handle element picker result
  function handleRuleCreated(selector: string) {
    if (!customSelectors.includes(selector)) {
      customSelectors.push(selector);
      applyCosmeticRules();

      chrome.storage.local.set({ [storageKey]: customSelectors }, () => {
        console.log(`[AdShredder] Saved custom rule for ${hostname}:`, selector);
        
        chrome.runtime.sendMessage({
          type: 'ELEMENT_SHREDDED_STAT',
          hostname,
          selector
        }).catch(() => {});
      });
    }
  }

  // Message listener from popup UI
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

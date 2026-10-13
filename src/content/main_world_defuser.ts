/**
 * AdShredder by Mojo - MAIN World Defuser
 * Injected directly into the website's execution context (world: "MAIN")
 * Intercepts abusive window.open calls, click-jacking traps, pop-unders,
 * and obliterates YouTube / HTML5 video ads and anti-adblock popups.
 */

(function () {
  // Prevent double-injection
  if ((window as any).__ADSHREDDER_DEFUSER_ACTIVE__) return;
  (window as any).__ADSHREDDER_DEFUSER_ACTIVE__ = true;

  console.log('[AdShredder by Mojo] ⚡ MAIN World Defuser & Video Ad Annihilator active.');

  let lastUserActionTimestamp = 0;

  // 1. Track authentic user interactions
  const recordUserAction = (e: Event) => {
    if (e.isTrusted) {
      lastUserActionTimestamp = Date.now();
    }
  };

  ['pointerdown', 'mousedown', 'keydown', 'touchend', 'click', 'auxclick'].forEach((evt) => {
    window.addEventListener(evt, recordUserAction, { capture: true, passive: true });
  });

  // Preserve native window.open
  const nativeWindowOpen = window.open.bind(window);

  // Trusted domains where popups / new tabs and UI overlays must NEVER be blocked
  // (Webmail, Payments, Crypto, OAuth & Productivity platforms)
  const TRUSTED_DOMAINS = [
    // Webmail & Email Providers
    'outlook.live.com',
    'outlook.office.com',
    'office.com',
    'live.com',
    'microsoft.com',
    'mail.google.com',
    'mail.yahoo.com',
    'proton.me',
    'protonmail.com',
    'web.de',
    'gmx.net',
    'gmx.de',
    't-online.de',
    'icloud.com',

    // Financial, Payments & Crypto Gateways
    'nowpayments.io',
    'account.nowpayments.io',
    'nowpayments.net',
    'paypal.com',
    'stripe.com',
    'coinbase.com',
    'binance.com',
    'kraken.com',
    'wise.com',
    'klarna.com',

    // Authentication & OAuth Providers
    'facebook.com',
    'm.facebook.com',
    'fb.com',
    'accounts.google.com',
    'google.com',
    'appleid.apple.com',
    'apple.com',
    'login.live.com',
    'microsoftonline.com',
    'github.com',
    'gitlab.com',
    'discord.com',
    'twitter.com',
    'x.com',

    // Productivity & Cloud Suites
    'docs.google.com',
    'drive.google.com',
    'calendar.google.com',
    'slack.com',
    'notion.so',
    'trello.com',
    'jira.com',
    'atlassian.net',
    'amazon.com'
  ];

  function isTrustedContext(urlStr: string): boolean {
    const currentHost = window.location.hostname.toLowerCase();
    const isCurrentTrusted = TRUSTED_DOMAINS.some(
      (d) => currentHost === d || currentHost.endsWith('.' + d)
    );
    if (isCurrentTrusted) return true;

    if (!urlStr) return false;
    try {
      const targetHost = new URL(urlStr, window.location.href).hostname.toLowerCase();
      return TRUSTED_DOMAINS.some(
        (d) => targetHost === d || targetHost.endsWith('.' + d)
      );
    } catch {
      return false;
    }
  }

  // Suspicious popup URL patterns (Only known malicious ad-network domains)
  const POPUP_KEYWORDS = [
    'popads', 'popcash', 'propeller', 'exoclick', 'adsterra', 'clickadu',
    'adcash', 'admaven', 'traffichaus', 'syndication', 'onclick',
    'trafficstars', 'juicyads', 'hilltopads', 'zeroredirect', 'rtmark'
  ];

  function isSuspiciousUrl(url: string): boolean {
    if (!url || url === 'about:blank') return false;
    const lower = url.toLowerCase();
    return POPUP_KEYWORDS.some((kw) => lower.includes(kw));
  }

  // Intercept window.open
  window.open = function (
    url?: string | URL,
    target?: string,
    features?: string
  ): WindowProxy | null {
    const now = Date.now();
    const timeSinceAction = now - lastUserActionTimestamp;
    const urlStr = url ? url.toString() : '';

    // If user disabled AdShredder, do not block popups!
    if (document.documentElement.hasAttribute('data-adshredder-off')) {
      return nativeWindowOpen(url, target, features);
    }

    // ALWAYS allow popups on or to trusted domains (Outlook, NowPayments, Gmail, OAuth, etc.)
    if (isTrustedContext(urlStr)) {
      return nativeWindowOpen(url, target, features);
    }

    const isUnprompted = timeSinceAction > 5000;
    const isSuspicious = isSuspiciousUrl(urlStr);
    const isSneakyPosition = features && features.includes('-999');

    if (isUnprompted || isSuspicious || isSneakyPosition) {
      // Use console.log to avoid Chrome flagging this as an extension error
      console.log(`[AdShredder by Mojo] 🛑 Blocked popup to: "${urlStr || 'blank'}" (time diff: ${timeSinceAction}ms)`);
      
      window.dispatchEvent(
        new CustomEvent('__ADSHREDDER_POPUP_BLOCKED__', {
          detail: { url: urlStr, reason: isSuspicious ? 'suspicious_domain' : 'unprompted_open' }
        })
      );

      return {
        closed: false,
        focus: () => {},
        blur: () => {},
        close: () => {},
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      } as unknown as WindowProxy;
    }

    return nativeWindowOpen(url, target, features);
  };

  // 2. Anti-Clickjacking: Defuse invisible full-screen overlay traps
  const isTrustedDomain = TRUSTED_DOMAINS.some(
    (d) => window.location.hostname.toLowerCase() === d || window.location.hostname.toLowerCase().endsWith('.' + d)
  );

  const removeClickjackingOverlays = () => {
    if (isTrustedDomain) return;
    if (document.documentElement.hasAttribute('data-adshredder-off')) return;

    const elements = document.querySelectorAll('div, a, span, iframe');
    for (const el of Array.from(elements)) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.id?.startsWith('adshredder-')) continue;

      // Exempt Facebook and Google SDK frames and containers
      if (
        htmlEl.id === 'fb-root' ||
        htmlEl.id?.includes('facebook') ||
        (typeof htmlEl.className === 'string' && htmlEl.className.includes('fb_')) ||
        (htmlEl as HTMLIFrameElement).src?.includes('facebook.com') ||
        (htmlEl as HTMLIFrameElement).src?.includes('google.com')
      ) {
        continue;
      }

      // Exempt UI frameworks modal/layer backdrops (Fluent UI, Material, Bootstrap, etc.)
      const classStr = typeof htmlEl.className === 'string' ? htmlEl.className : '';
      if (
        classStr.includes('ms-Layer') ||
        classStr.includes('ms-Overlay') ||
        classStr.includes('ms-Modal') ||
        classStr.includes('ms-Callout') ||
        classStr.includes('fluent') ||
        classStr.includes('MuiBackdrop') ||
        classStr.includes('MuiModal') ||
        classStr.includes('cdk-overlay') ||
        classStr.includes('modal-backdrop') ||
        classStr.includes('dialog-backdrop') ||
        classStr.includes('chakra-portal') ||
        classStr.includes('radix') ||
        htmlEl.getAttribute('role') === 'dialog' ||
        htmlEl.getAttribute('role') === 'presentation' ||
        htmlEl.getAttribute('aria-modal') === 'true'
      ) {
        continue;
      }

      const style = window.getComputedStyle(htmlEl);
      if (
        (style.position === 'fixed' || style.position === 'absolute') &&
        parseInt(style.zIndex, 10) > 99999
      ) {
        const rect = htmlEl.getBoundingClientRect();
        const isFullScreen =
          rect.width >= window.innerWidth * 0.9 &&
          rect.height >= window.innerHeight * 0.9;

        const isTransparent =
          parseFloat(style.opacity) < 0.1 ||
          style.backgroundColor === 'transparent' ||
          style.backgroundColor === 'rgba(0, 0, 0, 0)';

        if (isFullScreen && isTransparent && !htmlEl.innerText.trim()) {
          // Use console.log so Chrome does not flag this as an error in chrome://extensions/
          console.log('[AdShredder by Mojo] 🛡️ Neutralized invisible clickjack overlay:', htmlEl);
          htmlEl.remove();
          window.dispatchEvent(
            new CustomEvent('__ADSHREDDER_POPUP_BLOCKED__', {
              detail: { url: 'clickjack_overlay', reason: 'transparent_fullscreen_trap' }
            })
          );
        }
      }
    }
  };

  // 3. YouTube & Video Ad Annihilator
  const annihilateVideoAds = () => {
    if (document.documentElement.hasAttribute('data-adshredder-off')) return;
    const isYouTube = window.location.hostname.includes('youtube.com');
    const video = document.querySelector('video') as HTMLVideoElement | null;
    const moviePlayer = document.getElementById('movie_player') as any;

    if (isYouTube) {
      // Check if YouTube is showing a video ad
      const adShowing =
        document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay') !== null ||
        (moviePlayer && moviePlayer.classList?.contains('ad-showing'));

      if (video && adShowing) {
        // Fast-forward video ad to completion at maximum speed (64x)
        video.muted = true;
        try {
          video.playbackRate = 64.0;
        } catch {
          video.playbackRate = 16.0;
        }

        if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
          video.currentTime = video.duration;
        }

        // Fire 'ended' event directly to notify YouTube's player that the ad is finished
        try {
          video.dispatchEvent(new Event('ended'));
        } catch {}

        // Try calling player native skip
        if (moviePlayer && typeof moviePlayer.skipAd === 'function') {
          try { moviePlayer.skipAd(); } catch {}
        }
      }

      // Auto-click any skip button that appears
      const skipButtons = document.querySelectorAll<HTMLElement>(
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-slot button, .ytp-ad-preview-container'
      );
      skipButtons.forEach((btn) => {
        try { btn.click(); } catch {}
      });

      // Defuse YouTube Anti-Adblock warning modals
      const enforcementModal = document.querySelector('ytd-enforcement-message-view-model');
      if (enforcementModal) {
        enforcementModal.remove();
        document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach((el) => el.remove());
        if (video && video.paused) {
          video.play();
        }
      }
    }
  };

  // Fast hyper-loop for instant video ad annihilation (60ms)
  setInterval(annihilateVideoAds, 60);

  // Run DOM scans
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeClickjackingOverlays);
  } else {
    removeClickjackingOverlays();
  }

  const observer = new MutationObserver(() => {
    removeClickjackingOverlays();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

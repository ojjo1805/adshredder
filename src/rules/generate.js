const fs = require('fs');
const path = require('path');

const DEFAULT_BLOCKED_DOMAINS = [
  // 1. Gaming & .io Web-Game Ad Networks (Agar.io, Slither.io, Krunker, etc.)
  'adinplay.com',
  'api.adinplay.com',
  'playwire.com',
  'config.playwire.com',
  'intergi.com',
  'cdn.intergi.com',
  'freestar.io',
  'freestar.com',
  'a.freestar.io',
  'nitropay.com',
  'cpmstar.com',
  'server.cpmstar.com',
  'snigelweb.com',
  'snigel.com',
  'snigel.net',
  'venatus.com',
  'venatusmedia.com',
  'vntsm.com',

  // 2. Global Display, Video & Programmatic Ad Networks
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  '2mdn.net',
  'adservice.google.com',
  'amazon-adsystem.com',
  'aax-us-east.amazon-adsystem.com',
  'criteo.com',
  'criteo.net',
  'static.criteo.net',
  'taboola.com',
  'cdn.taboola.com',
  'outbrain.com',
  'outbrainimg.com',
  'rubiconproject.com',
  'optimized-by.rubiconproject.com',
  'pubmatic.com',
  'ads.pubmatic.com',
  'openx.net',
  'openx.com',
  'adnxs.com',
  'ib.adnxs.com',
  'adnxs-simple.com',
  'casalemedia.com',
  'indexww.com',
  'smartadserver.com',
  'equativ.com',
  'media.net',
  'inmobi.com',
  'smaato.net',
  'sovrn.com',
  'lijit.com',
  'triplelift.com',
  'sharethrough.com',
  'mgid.com',
  'revcontent.com',
  'zedo.com',
  'exponential.com',
  'yieldmo.com',
  'adroll.com',
  'adform.net',
  'advertising.com',
  'adblade.com',
  'adcolony.com',
  'applovin.com',
  'unityads.unity3d.com',
  'vungle.com',
  'chartboost.com',
  'moatads.com',
  'iasds01.com',
  'teads.tv',
  'teads.com',
  'ezoic.net',
  'ezoic.com',
  'mediavine.com',
  'adthrive.com',
  'raptive.com',
  'infolinks.com',
  'bidvertiser.com',
  'seedtag.com',
  'seedtag.net',
  'sulvo.com',
  'sulvo.net',
  'setupad.com',
  'setupad.net',
  'monumetric.com',
  'gumgum.com',
  'undertone.com',
  'kargo.com',
  'connatix.com',
  'aniview.com',
  'primis.tech',
  'minute.ly',

  // 3. Popups, Pop-Unders & Malicious Redirectors
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'exoclick.com',
  'adsterra.com',
  'revenuehits.com',
  'clickadu.com',
  'adcash.com',
  'hilltopads.net',
  'trafficstars.com',
  'juicyads.com',
  'plugrush.com',
  'admaven.com',
  'yllix.com',
  'popmyads.com',
  'onclickalgo.com',
  'syndication.exoclick.com',
  'tsyndicate.com',
  'ero-advertising.com',
  'traffichaus.com',
  'wigetmedia.com',
  'onclickads.net',
  'ad-maven.com',
  'zeroredirect1.com',
  'zeroredirect2.com',
  'rtmark.net',
  'adpushup.com',

  // 4. Trackers, Surveillance & Telemetry
  'scorecardresearch.com',
  'quantserve.com',
  'quantcount.com',
  'moatpixel.com',
  'hotjar.com',
  'hotjar.io',
  'clarity.ms',
  'crazyegg.com',
  'clicktale.net',
  'mouseflow.com',
  'fullstory.com',
  'luckyorange.com',
  'inspectlet.com',
  'statcounter.com',
  'histats.com',
  'mc.yandex.ru',
  'an.yandex.ru',
  'gemius.pl',
  'top-fwz1.mail.ru',
  'appsflyer.com',
  'adjust.com',
  'chartbeat.com',

  // 5. China & East Asia (Baidu, Tencent, Alibaba, Sina)
  'pos.baidu.com',
  'cpro.baidu.com',
  'dup.baidustatic.com',
  'eclick.baidu.com',
  'tanx.com',
  'alimama.com',
  'gdt.qq.com',
  'sax.sina.com.cn',

  // 6. Japan (Yahoo! Japan Ads, MicroAd, Geniee, i-mobile, Fluct)
  'yads.c.yimg.jp',
  'yads.yahoo.co.jp',
  'microad.jp',
  'microad.net',
  'geniee.co.jp',
  'gssprt.jp',
  'i-mobile.co.jp',
  'fluct.jp',
  'ad-stir.com',

  // 7. Korea (Daum AdFit, Dable, WiderPlanet, RealClick)
  'adfit.daum.net',
  't1.daumcdn.net/adfit',
  'dable.io',
  'api.dable.io',
  'widerplanet.com',
  'realclick.co.kr',

  // 8. Middle East & MENA (Arabic, Persian, Hebrew)
  'speakol.com',
  'cdn.speakol.com',
  'jubna.com',
  'cdn.jubna.com',
  'yektanet.com',
  'cdn.yektanet.com',
  'sabavision.com',
  'mediaad.org',
  'artimedia.tech',

  // 9. India & South Asia (Columbia / Times Internet)
  'clmbtech.com',
  'ade.clmbtech.com',

  // 10. Russia & Cyrillic (Yandex Direct, Mail.ru Ads)
  'yabs.yandex.ru',
  'target.my.com',
  'ad.mail.ru',
  'advmaker.net'
];

const URL_FILTER_PATTERNS = [
  '*/pagead/js/adsbygoogle.js',
  '*/adservice.google.*',
  '*/gpt.js',
  '*/prebid.js',
  '*/prebid*.js',
  '*/aip.js',
  '*/aiptag/*',
  '*://*/ads.js',
  '*://*/advertisement.js',
  '*://*/ad_banner.*',
  '*://*/popunder.js',
  '*://*/popup.js?*ad*',
  '*://*/ad-provider.*',
  '*://*/*/adframe.*',
  '*://*/sponsor-banner.*',
  '*/wp-content/plugins/adrotate/*',
  '*/wp-content/plugins/ad-inserter/*',
  '*://*/*banner-ad*',
  '*://*/*adskeeper*'
];

const allResourceTypes = [
  'main_frame', 'sub_frame', 'stylesheet', 'script',
  'image', 'font', 'object', 'xmlhttprequest',
  'ping', 'csp_report', 'media', 'websocket', 'other'
];

const rules = [];
let ruleId = 1;

for (const domain of DEFAULT_BLOCKED_DOMAINS) {
  rules.push({
    id: ruleId++,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: allResourceTypes
    }
  });
}

for (const pattern of URL_FILTER_PATTERNS) {
  rules.push({
    id: ruleId++,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: pattern,
      resourceTypes: ['script', 'sub_frame', 'xmlhttprequest', 'image', 'other']
    }
  });
}

const outputPath = path.resolve(__dirname, 'rules.json');
fs.writeFileSync(outputPath, JSON.stringify(rules, null, 2), 'utf-8');
console.log(`Successfully compiled ${rules.length} global DNR rules into ${outputPath}`);

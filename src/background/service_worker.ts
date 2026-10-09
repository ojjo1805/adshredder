/**
 * AdShredder by Mojo - Background Service Worker
 * Stateless, event-driven background engine for Manifest V3.
 */

import { DNRManager } from './dnr_manager';

// Initialize defaults on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[AdShredder by Mojo] 🚀 Extension installed. Initializing engine...');
  const data = await chrome.storage.local.get([
    'master_enabled',
    'stats_total_ads',
    'stats_total_popups',
    'stats_total_elements',
    'whitelisted_domains'
  ]);

  const masterEnabled = data.master_enabled ?? true;
  await chrome.storage.local.set({
    master_enabled: masterEnabled,
    stats_total_ads: data.stats_total_ads ?? 0,
    stats_total_popups: data.stats_total_popups ?? 0,
    stats_total_elements: data.stats_total_elements ?? 0,
    whitelisted_domains: data.whitelisted_domains ?? []
  });

  await DNRManager.init(masterEnabled);
  await updateBadge();
});

// Update Action Badge
async function updateBadge() {
  const data = await chrome.storage.local.get(['master_enabled', 'stats_total_popups', 'stats_total_ads']);
  if (data.master_enabled === false) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    return;
  }

  const total = (data.stats_total_ads || 0) + (data.stats_total_popups || 0);
  if (total > 0) {
    const display = total > 999 ? `${(total / 1000).toFixed(1)}k` : `${total}`;
    chrome.action.setBadgeText({ text: display });
  } else {
    chrome.action.setBadgeText({ text: 'ON' });
  }
  chrome.action.setBadgeBackgroundColor({ color: '#06b6d4' });
}

// Track matched declarative rules in development mode (if available)
if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {
    if (info.rule.ruleId < 100000) { // Block rule
      const data = await chrome.storage.local.get(['stats_total_ads']);
      const count = (data.stats_total_ads || 0) + 1;
      await chrome.storage.local.set({ stats_total_ads: count });
      await updateBadge();
    }
  });
}

// Central Message Dispatcher
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message.type === 'POPUP_BLOCKED_STAT') {
      const data = await chrome.storage.local.get(['stats_total_popups']);
      const count = (data.stats_total_popups || 0) + 1;
      await chrome.storage.local.set({ stats_total_popups: count });
      await updateBadge();
      sendResponse({ success: true, count });
      return;
    }

    if (message.type === 'ELEMENT_SHREDDED_STAT') {
      const data = await chrome.storage.local.get(['stats_total_elements']);
      const count = (data.stats_total_elements || 0) + 1;
      await chrome.storage.local.set({ stats_total_elements: count });
      sendResponse({ success: true, count });
      return;
    }

    if (message.type === 'TOGGLE_MASTER') {
      const { enabled } = message;
      await chrome.storage.local.set({ master_enabled: enabled });
      await DNRManager.setMasterEnabled(enabled);
      await updateBadge();
      sendResponse({ success: true, enabled });
      return;
    }

    if (message.type === 'TOGGLE_DOMAIN_WHITELIST') {
      const { domain } = message;
      const data = await chrome.storage.local.get(['whitelisted_domains']);
      let list: string[] = data.whitelisted_domains || [];

      let isWhitelisted = false;
      if (list.includes(domain)) {
        list = list.filter((d) => d !== domain);
        isWhitelisted = false;
      } else {
        list.push(domain);
        isWhitelisted = true;
      }

      await chrome.storage.local.set({
        whitelisted_domains: list,
        [`whitelist_${domain}`]: isWhitelisted
      });
      await DNRManager.syncWhitelist(list);
      sendResponse({ success: true, isWhitelisted, list });
      return;
    }

    if (message.type === 'GET_ALL_STATS') {
      const data = await chrome.storage.local.get([
        'master_enabled',
        'stats_total_ads',
        'stats_total_popups',
        'stats_total_elements',
        'whitelisted_domains'
      ]);
      sendResponse(data);
      return;
    }
  })();

  return true; // Keep channel open for async response
});

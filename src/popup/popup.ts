/**
 * AdShredder by Mojo - Popup Controller
 * Manages UI interactions, statistics, whitelist toggling, and element picker triggers.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const masterToggle = document.getElementById('master-toggle') as HTMLInputElement;
  const domainToggle = document.getElementById('domain-toggle') as HTMLInputElement;
  const currentDomainEl = document.getElementById('current-domain') as HTMLElement;
  const btnStartPicker = document.getElementById('btn-start-picker') as HTMLButtonElement;
  const statAdsEl = document.getElementById('stat-ads') as HTMLElement;
  const statPopupsEl = document.getElementById('stat-popups') as HTMLElement;
  const statElementsEl = document.getElementById('stat-elements') as HTMLElement;
  const footerStatusEl = document.getElementById('footer-status') as HTMLElement;
  const customRulesContainer = document.getElementById('custom-rules-container') as HTMLElement;
  const btnClearRules = document.getElementById('btn-clear-domain-rules') as HTMLButtonElement;
  const whitelistContainer = document.getElementById('whitelist-container') as HTMLElement;

  let currentTabId: number | undefined;
  let currentDomain = '';

  // 1. Get Current Tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && activeTab.url) {
    currentTabId = activeTab.id;
    try {
      const url = new URL(activeTab.url);
      if (url.protocol.startsWith('http')) {
        currentDomain = url.hostname;
        currentDomainEl.textContent = currentDomain;
      } else {
        currentDomainEl.textContent = 'System Page';
        domainToggle.disabled = true;
        btnStartPicker.disabled = true;
      }
    } catch {
      currentDomainEl.textContent = 'Unknown';
    }
  }

  // 2. Load Stats & Preferences
  const data = await chrome.storage.local.get([
    'master_enabled',
    'stats_total_ads',
    'stats_total_popups',
    'stats_total_elements',
    'whitelisted_domains',
    currentDomain ? `whitelist_${currentDomain}` : ''
  ]);

  const isMasterEnabled = data.master_enabled ?? true;
  masterToggle.checked = isMasterEnabled;

  const isWhitelisted = currentDomain ? (data[`whitelist_${currentDomain}`] === true) : false;
  domainToggle.checked = !isWhitelisted;

  statAdsEl.textContent = `${data.stats_total_ads || 0}`;
  statPopupsEl.textContent = `${data.stats_total_popups || 0}`;
  statElementsEl.textContent = `${data.stats_total_elements || 0}`;

  updateFooterStatus(isMasterEnabled, !isWhitelisted);

  // 3. Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      if (targetTab) {
        document.getElementById(targetTab)?.classList.add('active');
      }

      if (targetTab === 'tab-rules') {
        loadRulesTab();
      }
    });
  });

  // 4. Master Toggle Listener
  masterToggle.addEventListener('change', async () => {
    const enabled = masterToggle.checked;
    await chrome.runtime.sendMessage({ type: 'TOGGLE_MASTER', enabled });
    updateFooterStatus(enabled, domainToggle.checked);
  });

  // 5. Domain Toggle Listener
  domainToggle.addEventListener('change', async () => {
    if (!currentDomain) return;
    const isProtected = domainToggle.checked;
    await chrome.runtime.sendMessage({
      type: 'TOGGLE_DOMAIN_WHITELIST',
      domain: currentDomain
    });
    updateFooterStatus(masterToggle.checked, isProtected);
  });

  // 6. Start Element Picker
  btnStartPicker.addEventListener('click', async () => {
    if (!currentTabId) return;
    try {
      await chrome.tabs.sendMessage(currentTabId, { type: 'START_ELEMENT_PICKER' });
      // Close popup so user immediately has full screen control
      window.close();
    } catch (err) {
      alert('Could not start Element Picker on this page. Refresh the page and try again!');
    }
  });

  // 7. Rules Tab Management
  async function loadRulesTab() {
    // Load custom rules for active tab
    if (currentTabId && currentDomain) {
      try {
        const response = await chrome.tabs.sendMessage(currentTabId, { type: 'GET_PAGE_STATS' });
        if (response && response.customSelectors && response.customSelectors.length > 0) {
          customRulesContainer.innerHTML = '';
          response.customSelectors.forEach((sel: string) => {
            const item = document.createElement('div');
            item.className = 'rule-item';
            item.textContent = sel;
            customRulesContainer.appendChild(item);
          });
        } else {
          customRulesContainer.innerHTML = '<div class="empty-state">No custom elements shredded on this site yet.</div>';
        }
      } catch {
        customRulesContainer.innerHTML = '<div class="empty-state">Unable to load rules from active tab.</div>';
      }
    }

    // Load global whitelisted domains
    const storage = await chrome.storage.local.get(['whitelisted_domains']);
    const list: string[] = storage.whitelisted_domains || [];
    if (list.length > 0) {
      whitelistContainer.innerHTML = '';
      list.forEach((domain) => {
        const item = document.createElement('div');
        item.className = 'rule-item';
        item.textContent = domain;
        whitelistContainer.appendChild(item);
      });
    } else {
      whitelistContainer.innerHTML = '<div class="empty-state">No sites whitelisted. Protection is active everywhere.</div>';
    }
  }

  // Clear domain rules
  btnClearRules.addEventListener('click', async () => {
    if (currentTabId && currentDomain) {
      await chrome.tabs.sendMessage(currentTabId, { type: 'CLEAR_DOMAIN_RULES' });
      customRulesContainer.innerHTML = '<div class="empty-state">Cleared all rules for this domain.</div>';
    }
  });

  // 8. Copy Crypto Addresses
  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      const input = document.getElementById(targetId) as HTMLInputElement;
      if (input) {
        await navigator.clipboard.writeText(input.value);
        const originalText = btn.textContent;
        btn.textContent = 'Copied! ✅';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 1800);
      }
    });
  });

  // 9. Ko-fi Button Tab Opener
  const btnKofi = document.getElementById('btn-kofi');
  btnKofi?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://ko-fi.com/mojo1805' });
  });

  // 10. NOWPayments Multi-Crypto Portal Tab Opener
  const btnNowPayments = document.getElementById('btn-nowpayments');
  btnNowPayments?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://nowpayments.io/donation/adshredder_mojo' });
  });

  // 11. Report Issue Modal & Handlers
  const btnOpenReport = document.getElementById('btn-open-report');
  const btnCloseReport = document.getElementById('btn-close-report');
  const reportModal = document.getElementById('report-modal');
  const reportTargetDomainEl = document.getElementById('report-target-domain');
  const btnReportGithub = document.getElementById('btn-report-github');
  const btnReportKofi = document.getElementById('btn-report-kofi');

  btnOpenReport?.addEventListener('click', () => {
    if (reportTargetDomainEl) {
      reportTargetDomainEl.textContent = currentDomain && currentDomain !== 'System Page' ? currentDomain : 'this website';
    }
    if (reportModal) {
      reportModal.style.display = 'flex';
    }
  });

  btnCloseReport?.addEventListener('click', () => {
    if (reportModal) {
      reportModal.style.display = 'none';
    }
  });

  reportModal?.addEventListener('click', (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = 'none';
    }
  });

  btnReportGithub?.addEventListener('click', () => {
    const domain = currentDomain && currentDomain !== 'System Page' ? currentDomain : 'website';
    const issueTitle = encodeURIComponent(`[Filter Issue] Problem on ${domain}`);
    const issueBody = encodeURIComponent(
`### Problem Report for AdShredder by Mojo

- **Website / URL**: https://${domain}
- **Issue Type**: [ ] Slipped Ad  [ ] Broken Layout / Blank Page  [ ] Other
- **Description**: (Please describe what happened here)

---
*Environment: AdShredder v1.0.0 on Chrome*`
    );
    const githubUrl = `https://github.com/ojjo1805/adshredder/issues/new?title=${issueTitle}&body=${issueBody}`;
    chrome.tabs.create({ url: githubUrl });
    if (reportModal) reportModal.style.display = 'none';
  });

  btnReportKofi?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://ko-fi.com/mojo1805' });
    if (reportModal) reportModal.style.display = 'none';
  });

  function updateFooterStatus(master: boolean, domainActive: boolean) {
    if (!master) {
      footerStatusEl.textContent = '⚪ Protection Paused';
      footerStatusEl.style.color = '#9ca3af';
    } else if (!domainActive) {
      footerStatusEl.textContent = '⚠️ Whitelisted (Off)';
      footerStatusEl.style.color = '#f59e0b';
    } else {
      footerStatusEl.textContent = '⚡ Active Protection';
      footerStatusEl.style.color = '#10b981';
    }
  }
});

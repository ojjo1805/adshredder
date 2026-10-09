/**
 * AdShredder by Mojo - DeclarativeNetRequest Manager
 * Manages static rulesets and dynamic rules for domain whitelisting in MV3.
 */

export class DNRManager {
  private static DYNAMIC_RULE_BASE_ID = 100000;

  /**
   * Initializes declarative rules and ensures static ruleset is active if master is enabled.
   */
  public static async init(masterEnabled: boolean = true) {
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: masterEnabled ? ['ruleset_1'] : [],
        disableRulesetIds: masterEnabled ? [] : ['ruleset_1']
      });
    } catch (err) {
      console.error('[AdShredder by Mojo] Failed to update ruleset status:', err);
    }
  }

  /**
   * Updates master enabled state.
   */
  public static async setMasterEnabled(enabled: boolean) {
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: enabled ? ['ruleset_1'] : [],
        disableRulesetIds: enabled ? [] : ['ruleset_1']
      });
    } catch (err) {
      console.error('[AdShredder by Mojo] Failed to toggle master DNR status:', err);
    }
  }

  /**
   * Synchronizes dynamic allow rules with the user's domain whitelist.
   */
  public static async syncWhitelist(whitelistedDomains: string[]) {
    try {
      // Get existing dynamic rules
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const removeRuleIds = existingRules.map((r) => r.id);

      const addRules: chrome.declarativeNetRequest.Rule[] = whitelistedDomains.map(
        (domain, index) => ({
          id: this.DYNAMIC_RULE_BASE_ID + index,
          priority: 9999, // High priority to override blocking rules
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.ALLOW_ALL_REQUESTS
          },
          condition: {
            initiatorDomains: [domain],
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME
            ]
          }
        })
      );

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds,
        addRules
      });
      console.log(`[AdShredder by Mojo] Whitelist synced with ${addRules.length} domains.`);
    } catch (err) {
      console.error('[AdShredder by Mojo] Failed to sync whitelist rules:', err);
    }
  }
}

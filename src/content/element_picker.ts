/**
 * AdShredder by Mojo - Element Picker
 * Interactive visual element selector with closed Shadow DOM.
 * Allows users to click and permanently hide any annoying element on a page.
 */

export class ElementPicker {
  private active = false;
  private container: HTMLDivElement | null = null;
  private shadow: ShadowRoot | null = null;
  private highlightBox: HTMLDivElement | null = null;
  private tooltip: HTMLDivElement | null = null;
  private modal: HTMLDivElement | null = null;
  private currentTarget: HTMLElement | null = null;
  private currentSelector = '';
  private onRuleCreated: (selector: string) => void;

  constructor(onRuleCreated: (selector: string) => void) {
    this.onRuleCreated = onRuleCreated;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public start() {
    if (this.active) return;
    this.active = true;
    this.createUI();
    this.attachEvents();
  }

  public stop() {
    if (!this.active) return;
    this.active = false;
    this.detachEvents();
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.shadow = null;
    }
    this.currentTarget = null;
    this.modal = null;
  }

  private createUI() {
    this.container = document.createElement('div');
    this.container.id = 'adshredder-picker-root';
    this.container.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;';

    // Closed shadow DOM for complete style isolation
    this.shadow = this.container.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .highlight-box {
        position: fixed;
        pointer-events: none;
        border: 2px solid #06b6d4;
        background: rgba(6, 182, 212, 0.18);
        box-shadow: 0 0 16px rgba(6, 182, 212, 0.75);
        transition: all 0.05s ease-out;
        z-index: 2147483646;
        display: none;
        border-radius: 4px;
      }
      .tooltip {
        position: fixed;
        background: #0f172a;
        color: #f8fafc;
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 6px;
        border: 1px solid #1e293b;
        pointer-events: none;
        z-index: 2147483647;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5);
        display: none;
        max-width: 380px;
        word-break: break-all;
      }
      .tooltip-tag { color: #38bdf8; font-weight: bold; }
      .tooltip-desc { color: #94a3b8; font-size: 11px; margin-top: 2px; }
      .modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        z-index: 2147483647;
      }
      .modal-card {
        background: #0f172a;
        color: #fafafa;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 22px;
        width: 440px;
        max-width: 90vw;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        pointer-events: auto;
      }
      .modal-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 700;
        color: #06b6d4;
        margin-bottom: 12px;
      }
      .modal-body {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 18px;
        line-height: 1.5;
      }
      .selector-code {
        background: #020617;
        color: #38bdf8;
        padding: 10px 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 12px;
        border: 1px solid #1e293b;
        margin-top: 10px;
        word-break: break-all;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .btn {
        padding: 9px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.15s ease;
        pointer-events: auto;
      }
      .btn-cancel {
        background: #1e293b;
        color: #e2e8f0;
      }
      .btn-cancel:hover { background: #334155; color: #ffffff; }
      .btn-shred {
        background: linear-gradient(135deg, #06b6d4 0%, #0d9488 100%);
        color: #ffffff;
        box-shadow: 0 0 14px rgba(6, 182, 212, 0.4);
      }
      .btn-shred:hover { background: linear-gradient(135deg, #0891b2 0%, #0f766e 100%); transform: translateY(-1px); }
      .btn-shred:active { transform: translateY(1px); }
    `;
    this.shadow.appendChild(style);

    this.highlightBox = document.createElement('div');
    this.highlightBox.className = 'highlight-box';
    this.shadow.appendChild(this.highlightBox);

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.shadow.appendChild(this.tooltip);

    document.documentElement.appendChild(this.container);
  }

  private attachEvents() {
    window.addEventListener('mousemove', this.handleMouseMove, { capture: true, passive: false });
    window.addEventListener('click', this.handleClick, { capture: true, passive: false });
    window.addEventListener('keydown', this.handleKeyDown, { capture: true, passive: false });
  }

  private detachEvents() {
    window.removeEventListener('mousemove', this.handleMouseMove, { capture: true });
    window.removeEventListener('click', this.handleClick, { capture: true });
    window.removeEventListener('keydown', this.handleKeyDown, { capture: true });
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.active || this.modal) return;

    // Find actual target beneath cursor
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (!target || target === document.documentElement || target === document.body || target === this.container) {
      if (this.highlightBox) this.highlightBox.style.display = 'none';
      if (this.tooltip) this.tooltip.style.display = 'none';
      return;
    }

    this.currentTarget = target;
    const rect = target.getBoundingClientRect();

    if (this.highlightBox) {
      this.highlightBox.style.display = 'block';
      this.highlightBox.style.top = `${rect.top}px`;
      this.highlightBox.style.left = `${rect.left}px`;
      this.highlightBox.style.width = `${rect.width}px`;
      this.highlightBox.style.height = `${rect.height}px`;
    }

    this.currentSelector = this.generateOptimalSelector(target);

    if (this.tooltip) {
      this.tooltip.style.display = 'block';
      this.tooltip.innerHTML = `
        <span class="tooltip-tag">&lt;${target.tagName.toLowerCase()}&gt;</span> ${target.id ? '#' + target.id : ''}
        <div class="tooltip-desc">${Math.round(rect.width)} × ${Math.round(rect.height)}px — Click to Shred</div>
      `;

      let top = rect.top - 40;
      let left = rect.left;
      if (top < 10) top = rect.bottom + 10;
      if (left + 250 > window.innerWidth) left = window.innerWidth - 260;
      if (left < 10) left = 10;

      this.tooltip.style.top = `${top}px`;
      this.tooltip.style.left = `${left}px`;
    }
  }

  private handleClick(e: MouseEvent) {
    if (!this.active) return;

    // If modal is already open, do not intercept clicks destined for modal
    if (this.modal) return;

    e.preventDefault();
    e.stopPropagation();

    if (!this.currentTarget) return;

    this.showConfirmationModal();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.stop();
    }
  }

  private showConfirmationModal() {
    if (!this.shadow || !this.currentTarget) return;

    // Detach window capture listeners so the modal buttons can be clicked normally!
    this.detachEvents();

    // Hide highlight & tooltip while modal is open
    if (this.highlightBox) this.highlightBox.style.display = 'none';
    if (this.tooltip) this.tooltip.style.display = 'none';

    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <span>⚡ AdShredder by Mojo</span>
        </div>
        <div class="modal-body">
          Do you want to permanently shred this element on <strong>${window.location.hostname}</strong>?
          <div class="selector-code">${this.currentSelector}</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" id="btn-cancel">Cancel (Esc)</button>
          <button class="btn btn-shred" id="btn-shred">Shred Element 💥</button>
        </div>
      </div>
    `;

    this.shadow.appendChild(this.modal);

    const btnCancel = this.modal.querySelector('#btn-cancel') as HTMLButtonElement;
    const btnShred = this.modal.querySelector('#btn-shred') as HTMLButtonElement;

    // Modal cancel button
    btnCancel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.stop();
    });

    // Modal confirm shred button
    btnShred.addEventListener('click', (e) => {
      e.stopPropagation();

      // 1. Immediate visual annihilation (inline style + attribute)
      if (this.currentTarget) {
        this.currentTarget.style.setProperty('display', 'none', 'important');
        this.currentTarget.style.setProperty('visibility', 'hidden', 'important');
        this.currentTarget.setAttribute('data-adshredder-shredded', 'true');
      }

      // Also shred any other elements matching the exact selector on current page
      try {
        const matches = document.querySelectorAll(this.currentSelector);
        matches.forEach((el) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
        });
      } catch {}

      // 2. Persist rule to storage & dynamic CSS engine
      this.onRuleCreated(this.currentSelector);

      // 3. Clean up modal and stop picker
      this.stop();
    });

    // ESC key listener while modal is open
    const modalKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', modalKeyHandler);
        this.stop();
      }
    };
    window.addEventListener('keydown', modalKeyHandler);
  }

  /**
   * Generates a robust, resilient CSS selector for the chosen element.
   */
  private generateOptimalSelector(el: HTMLElement): string {
    // 1. Check ID (if not auto-generated hash)
    if (el.id && !/\d{6,}/.test(el.id) && !/^[a-z0-9]{20,}$/i.test(el.id)) {
      return `#${CSS.escape(el.id)}`;
    }

    // 2. Check useful attributes (data-testid, role, aria-label)
    for (const attr of ['data-ad-slot', 'data-slot', 'data-testid', 'aria-label', 'role']) {
      const val = el.getAttribute(attr);
      if (val) {
        return `${el.tagName.toLowerCase()}[${attr}="${CSS.escape(val)}"]`;
      }
    }

    // 3. Meaningful classes
    const classes = Array.from(el.classList).filter(
      (c) => !/\d{5,}/.test(c) && !/^(active|open|show|visible|selected)$/i.test(c)
    );
    if (classes.length > 0) {
      const classSelector = classes.slice(0, 2).map((c) => `.${CSS.escape(c)}`).join('');
      return `${el.tagName.toLowerCase()}${classSelector}`;
    }

    // 4. Hierarchical path up to 3 levels
    const parts: string[] = [];
    let curr: HTMLElement | null = el;
    let depth = 0;

    while (curr && curr !== document.body && curr !== document.documentElement && depth < 3) {
      let part = curr.tagName.toLowerCase();
      if (curr.id && !/\d{6,}/.test(curr.id)) {
        parts.unshift(`#${CSS.escape(curr.id)}`);
        break;
      }
      const parent = curr.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === curr!.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(curr) + 1;
          part += `:nth-of-type(${index})`;
        }
      }
      parts.unshift(part);
      curr = parent;
      depth++;
    }

    return parts.join(' > ');
  }
}

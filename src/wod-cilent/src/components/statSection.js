class StatSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['empty', 'name', 'displayName'];
  }

  attributeChangedCallback(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || 'category';
    const displayName = this.getAttribute('heading') || name;
    
    this.shadowRoot.innerHTML = `
      <style>
        .sheet_section {
          border: none;
          border-top: 2px solid var(--theme-interface-100);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-family: var(--font-family-display);
          margin: 0 var(--spacing-md);
          margin-bottom: var(--spacing-sm);
          padding: 0;
        }

        .sheet_section-heading {
          font-family: var(--font-family-display);
          text-align: center;
          padding: 0 var(--spacing-sm);
          font-size: var(--size-font-lg);
          text-transform: capitalize;
          font-weight: var(--font-weight-bold);
        }
      </style>
      <fieldset id="${name}-section" class="sheet_section">
        <legend class="sheet_section-heading">${displayName}</legend>
        <slot></slot>
      </fieldset>
    `;
  }
}

customElements.define('stat-section', StatSection);
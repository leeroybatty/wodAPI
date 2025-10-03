class StatSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListener('stat-rating-changed', (e) => {
      this.calculateTotal();
    });
  }

  calculateTotal() {
  }

  render() {
    const name = this.getAttribute('name') || 'category';
    const displayName = this.getAttribute('display-name') || name;
    
    this.shadowRoot.innerHTML = `
      <style>
        .sheet_section {
          border: none;
          border-top: 2px solid var(--theme-interface-100);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-family: var(--font-family-display);
          font-weight: var(--font-weight-bold);
        }

        .sheet_section-heading {
          font-family: var(--font-family-display);
          text-align: center;
          padding: 0 var(--spacing-sm);
          font-size: var(--size-font-lg);
          text-transform: capitalize;
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
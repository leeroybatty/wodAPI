class StatColumn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.stats = {};
    this.total = 0;
    this.floor = parseInt(this.getAttribute('floor')) || 0;
  }

  connectedCallback() {
    this.render();
    this.addEventListener('stat-rating-changed', (e) => {
      this.calculateTotal();
      this.render();
    });
  }

  calculateTotal() {
    const statRatings = this.querySelectorAll('stat-rating');
    let total = this.floor;
    
    statRatings.forEach(rating => {
      total += rating.getValue();
    });
    
    this.total=total;
  }

  render() {
    const name = this.getAttribute('name') || 'category';
    const displayName = this.getAttribute('display-name') || name;
    
    this.shadowRoot.innerHTML = `
      <style>
        .sheet_section-column {
          border:  none;
          display: flex;
          flex-direction: column;
        }

        .sheet_column-heading {
          margin-block-start: 0;
          text-align: center;
          text-transform: capitalize;
          margin-block-end: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          justify-content: center;
        }

        .sheet_column-total, .sheet_column-title {
          margin: 0;
          padding: 0;
        }
      </style>

      <div id="${name}-column" class="sheet_section-column">
        <div class="sheet_column-heading">
          <h3 class="sheet_column-title">${displayName}</h3>
           <p class="sheet_column-total" aria-label="Sum of ${name}s: ${this.total}">
             (${this.total})
           </p>
        </div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('stat-column', StatColumn);
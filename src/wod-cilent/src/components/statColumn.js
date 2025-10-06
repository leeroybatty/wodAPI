class StatColumn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.total = parseInt(this.getAttribute('total')) ||  0;
    this.floor = parseInt(this.getAttribute('floor')) || 0;
    this.max = parseInt(this.getAttribute('max')) || undefined;
    this.availableStats = [];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.addEventListener('dropdown-changed', (e) => {
      if (e.target.getAttribute('slot') === 'dropdown') {
        this.handleDropdownSelection(e.detail.value);
      }
    });

    this.addEventListener('stat-rating-removed', (e) => {
      if (e.detail.value === 0) {
        this.handleStatRemoval(e.detail);
      }
    });

    this.addEventListener('stat-rating-changed', (e) => {
      this.calculateTotal();
      this.render();
    });
  }

  handleDropdownSelection(selectedId) {
    const statToShow = this.querySelector(`stat-rating[id="stat-id-${selectedId}"]`);
    if (statToShow) {
      statToShow.setValue(1);
      statToShow.show();
      
      const dropdown = this.getDropdown();
      if (dropdown) {
        const option = dropdown.querySelector(`option[value="${selectedId}"]`);
        if (option) option.remove();
        dropdown.querySelector('select').value = 'pending';
      }
    }
  }

  handleStatRemoval(detail) {
    const dropdown = this.getDropdown();
    if (dropdown) {
      dropdown.addOption({
        id: detail.id,
        name: detail.name
      });
    }
  }

  getDropdown() {
    const slot = this.shadowRoot.querySelector('slot[name="dropdown"]');
    return slot ? slot.assignedElements()[0] : null;
  }

  build(stats, hidden = false, removable = false) {
    this.availableStats = stats;
    const existingStats = this.querySelectorAll('stat-rating');
    existingStats.forEach(stat => stat.remove());
    for (let stat of stats) {
      const newStat = document.createElement('stat-rating');
      newStat.setAttribute('name', stat.name.toLowerCase());
      newStat.setAttribute('id', `stat-id-${stat.id}`);
      newStat.setAttribute('display-name', stat.name);
      newStat.setAttribute('value', 0);
      newStat.setAttribute('removable', removable === true);
      newStat.setAttribute('empty', hidden === true);
      this.appendChild(newStat);
    }
    this.total = 0;
  }

  calculateTotal(e) {
    const statRatings = this.querySelectorAll('stat-rating');
    let total = this.floor;
    statRatings.forEach(rating => { 
      total += rating.getValue();
    });
    this.total=total;
    if (this.max) {
      const dropdown = this.getDropdown();
      if (dropdown) {
        if(this.total < this.max) {
          dropdown.enable();
        } else {
          dropdown.disable();
        }
      }
    }
  }

   static get observedAttributes() {
    return ['total', 'name', 'displayName'];
  }

  attributeChangedCallback(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || 'category';
    const displayName = this.getAttribute('display-name') || name;
    
    this.shadowRoot.innerHTML = `
      <style>
        .sheet_section-column {
          border: none;
          display: flex;
          padding: 0 var(--spacing-md);
          flex-direction: column;
          max-width: 300px;
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
          font-family: var(--font-family-body);
        }
        .sheet_column-total {
          text-transform: none;
        }
      </style>

      <div id="${name}-column" class="sheet_section-column">
        <div class="sheet_column-heading">
          <h3 class="sheet_column-title">${displayName}</h3>
            <p 
              class="sheet_column-total"
              aria-label="Sum of ${name}s: ${this.total}${this.max ? `out of ${this.max}` : ''}"
            >
             (${this.total}${this.max ? ` out of ${this.max}` : ''})
           </p>
        </div>
        <div class="sheet_column-ratings" id="${name}-column-ratings">
          <slot>
          </slot>
        </div>
        <slot name="dropdown">
      </div>
    `;
  }
}

customElements.define('stat-column', StatColumn);
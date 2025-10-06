class StatRating extends HTMLElement {
  connectedCallback() {
    this.addEventListener('change', this.handleRatingChange.bind(this));
    if (this.hasAttribute('removable')) {
      this.addEventListener('change', this.handleRemoval.bind(this));
    }
    this.render();
  }

  render() {
    const name = this.getAttribute('name') || 'stat';
    const value = parseInt(this.getAttribute('value')) || 0;
    const displayName = this.getAttribute('display-name') || name;
    let ceiling = 5;
    if (this.getAttribute('ceiling') !== null) {
      ceiling = parseInt(this.getAttribute('ceiling'));
    }
    const min = parseInt(this.getAttribute('min')) || 0;
    const max = parseInt(this.getAttribute('max')) || Math.max(5, ceiling);
    const headingId = `${name}_heading`;
    const empty = this.hasAttribute('empty') && this.getAttribute('empty') !== 'false';

    const chargen = this.getAttribute('chargen') || false;
    
    const zeroRating = `
    <div class="sheet_stat-dot">
      <input
        class="sheet_stat-dot-control Remove"
        id="${name}_0"
        type="radio"
        name="${name}"
        value=0
        ${value === 0 ? "checked" : ""}
      />
      <label
        class="sheet_stat-dot-label"
        for="${name}_0"
      >
        ${displayName} 0
      </label>
    </div>`;

  this.innerHTML = `
    <div class="sheet_stat-entry${ max === 10 ? ' Long' : ''}${empty === true ? ' Hidden' : ''}" id="stat-${name}">
      <h4 class="sheet_stat-name" id="${headingId}">${displayName}</h4>
      <div class="sheet_stat-ramp" role="radiogroup" aria-labelledby="${headingId}">
        ${min === 0 ? zeroRating : ""}
        ${Array.from({length: ceiling}, (_, i) => {
          const dotValue = i + 1;
          const isChecked = dotValue === value ? 'checked' : '';
          const isFilled = dotValue <= value;
          return `
            <div class="sheet_stat-dot">
              <input
                class="sheet_stat-dot-control${isFilled ? ' Filled' : ''}"
                id="${name}_${dotValue}"
                type="radio"
                name="${name}"
                value="${dotValue}" 
                ${isChecked}
              />
              <label
                class="sheet_stat-dot-label"
                for="${name}_${dotValue}"
              >
                ${displayName} ${dotValue}
              </label>
            </div>
          `;
        }).join('')}
        ${Array.from({length: max - ceiling}, (_, i) => {
          const dotValue = ceiling + i + 1;
          const isChecked = dotValue === value ? 'checked' : '';
          const isFilled = dotValue <= value;
          return `
            <div class="sheet_stat-dot">
              <input
                class="sheet_stat-dot-control Ceilinged${isFilled ? ' Filled' : ''}"
                disabled="true"
                id="${name}_${dotValue}"
                type="radio"
                name="${name}"
                value="${dotValue}" 
                ${isChecked}
              />
              <label
                class="sheet_stat-dot-label"
                disabled="true"
                for="${name}_${dotValue}"
              >
                ${displayName} ${dotValue}
              </label>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  }

  setValue(newValue) {
    const name = this.getAttribute('name');
    const radios = this.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
      radio.checked = parseInt(radio.value) === newValue;
      if (radio.value > 0 && radio.value <= newValue) {
        radio.classList.add('Filled');
      } else {
        radio.classList.remove('Filled');
      }
    });
    this.dispatchEvent(new CustomEvent('stat-rating-changed', {
      detail: { 
        name: this.getAttribute('name'), 
        value: newValue,
        element: this
      },
      bubbles: true
    }));
  }

  getValue() {
    const name = this.getAttribute('name');
    const checkedRadio = this.querySelector(`input[name="${name}"]:checked`);
    return checkedRadio ? parseInt(checkedRadio.value) : 0;
  }

  show() {
    this.querySelector('.sheet_stat-entry').classList.remove('Hidden');
    if (this.getValue() === 0) {
      this.setValue(1)
    }
  }

  hide() {
    this.querySelector('.sheet_stat-entry').classList.add('Hidden');
  }

  handleRemoval(event) {
    if (event.target.type === 'radio') {
      const selectedValue = parseInt(event.target.value);
      if (selectedValue === 0) {
        this.hide();
        this.setValue(0);
        this.dispatchEvent(new CustomEvent('stat-rating-removed', {
          detail: { 
            name: this.getAttribute('name'),
            id: this.getAttribute('data-id'),
            value: selectedValue,
            element: this,
            category: this.getAttribute('category'),
            subcategory: this.getAttribute('subcategory')
          },
          bubbles: true
        }));
      }
    }
  }

  handleRatingChange(event) {
    if (event.target.type === 'radio' && !this.getAttribute('disabled') ) {
      const selectedElement = event.target;
      const selectedValue = parseInt(event.target.value);
      const name = event.target.name;
      const allRadios = this.querySelectorAll(`input[name="${name}"]`);
      allRadios.forEach(radio => {
        const radioValue = parseInt(radio.value);
        if (radioValue > 0 && radioValue <= selectedValue) {
          radio.classList.add('Filled');
        } else {
          radio.classList.remove('Filled');
        }
      });
      this.dispatchEvent(new CustomEvent('stat-rating-changed', {
        detail: { 
          name: this.getAttribute('name'), 
          value: selectedValue,
          element: this 
        },
        bubbles: true
      }));
    }
  }

  static get observedAttributes() {
    return ['value', 'ceiling', 'name', 'display-name', 'min', 'max'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'ceiling' || name === 'value') {
       this.enforceConstraints();
      }
      this.render();
    }
  }

  enforceConstraints() {
    const ceiling = parseInt(this.getAttribute('ceiling')) || 5;
    const min = parseInt(this.getAttribute('min')) || 0;
    const currentValue = parseInt(this.getAttribute('value')) || 0;
    
    if (currentValue > ceiling) {
      this.setAttribute('value', ceiling.toString());
    }

    if (min > ceiling) {
      this.setAttribute('min', ceiling.toString());
    }
    
   }
}

customElements.define('stat-rating', StatRating);
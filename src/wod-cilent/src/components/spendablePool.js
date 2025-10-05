class SpendablePool extends HTMLElement {
  connectedCallback() {
  this.render()
  this.addEventListener('change', this.handleRatingChange.bind(this));
    if (this.getAttribute('removable')) {
      this.addEventListener('change', this.handleRemoval.bind(this));
    } 
  }

  render() {
    const name = this.getAttribute('name') || 'pool';
    const displayName = this.getAttribute('display-name') || name;
    let rating = 0;
    if (this.getAttribute('rating') !== null) {
      rating = parseInt(this.getAttribute('rating'));
    }
    const min = parseInt(this.getAttribute('min')) || 0;
    const value = parseInt(this.getAttribute('value')) || 0;
    const max = parseInt(this.getAttribute('max')) || 10;
    const headingId = `${name}_pool_heading`;
    const empty = this.getAttribute('empty') || false;
    const chargen = this.getAttribute('chargen') || false;
    const freebies = this.getAttribute('freebies') || false;

    const zeroRating = `
    <div class="sheet_stat-dot">
      <input
        class="sheet_stat-dot-control Spendable Remove"
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
      <div class="sheet_stat-entry" id="statpool-${name}">
        <h4 class="sheet_stat-name" id="${headingId}">${displayName}</h4>
        <div class="sheet_stat-ramp" role="radiogroup" aria-labelledby="${headingId}">
          <div class="sheet_pool-rating">
            <div class="sheet_stat-permanent-dot Ceilinged">
            </div>
            ${zeroRating}
          </div>
          ${Array.from({length: rating}, (_, i) => {
            const dotValue = i + 1;
            const isChecked = dotValue === value ? 'checked' : '';
            const isFilled = dotValue <= value;
            const permRatingIsFilled = dotValue <= rating;
            return `
              <div class="sheet_pool-rating">
                <div class="sheet_stat-permanent-dot ${permRatingIsFilled ? 'Filled' : '' }">
                </div>
                <div class="sheet_stat-dot">
                  <input
                    class="sheet_stat-dot-control Spendable ${isFilled ? ' Filled' : ''}"
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
              </div>
            `;
          }).join('')}
          ${Array.from({length: max - rating}, (_, i) => {
            const dotValue = i + 1;
            const isChecked = dotValue === value ? 'checked' : '';
            const isFilled = dotValue <= value;
            const permRatingIsFilled = dotValue <= rating;
            return `
              <div class="sheet_pool-rating">
                <div class="sheet_stat-permanent-dot Ceilinged">
                </div>
                <div class="sheet_stat-dot">
                  <div class="sheet_stat-dot-control Spendable Ceilinged"></div>
                </div>
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
  }

  setMax(newMax) {
    this.setAttribute('max', newMax);
    this.render();
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
    if (event.target.type === 'radio');
    const selectedValue = parseInt(event.target.value);
    if (selectedValue === 0) {
      this.hide();
      this.setValue(0);
      this.dispatchEvent(new CustomEvent('stat-rating-removed', {
        detail: { 
          name: this.getAttribute('name'),
          id: this.getAttribute('id').split('-').pop(),
          value: selectedValue,
          element: this 
        },
        bubbles: true
      }));
    }
  }

  handleRatingChange(event) {
    if (event.target.type === 'radio') {
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
}

customElements.define('spendable-pool', SpendablePool);
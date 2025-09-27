class StatRating extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'stat';
    const displayName = this.getAttribute('display-name') || name;
    const ceiling = parseInt(this.getAttribute('ceiling')) || 5;
    const max = parseInt(this.getAttribute('max')) || Math.max(5,ceiling);
    const value = parseInt(this.getAttribute('value')) || 0;
    const headingId = `${name}_heading`;
    const chargen = this.getAttribute('chargen') || false;
    this.addEventListener('change', this.handleRatingChange.bind(this));
  
    this.innerHTML = `
      <div class="sheet_stat-entry">
        <h4 class="sheet_stat-name" id="${headingId}">${displayName}</h4>
        <div class="sheet_stat-ramp" role="radiogroup" aria-labelledby="${headingId}">
          ${Array.from({length: ceiling}, (_, i) => {
            const dotValue = i + 1;
            const isChecked = dotValue === value ? 'checked' : '';
            const isCeilinged = dotValue > ceiling
            const isFilled = dotValue <= value;
            return `
              <div class="sheet_stat-dot">
                <input
                  class="sheet_stat-dot-control${isFilled ? ' Filled' : ''}${isCeilinged ? ' Ceilinged' : ''}"
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
            const dotValue = ceiling + 1;
            const isChecked = dotValue === value ? 'checked' : '';
            const isCeilinged = dotValue > ceiling
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
    });
  }

  getValue() {
    const name = this.getAttribute('name');
    const checkedRadio = this.querySelector(`input[name="${name}"]:checked`);
    return checkedRadio ? parseInt(checkedRadio.value) : 0;
  }

  handleRatingChange(event) {
    if (event.target.type === 'radio') {
      const selectedElement = event.target;
      const selectedValue = parseInt(event.target.value);
      const name = event.target.name;
      const allRadios = this.querySelectorAll(`input[name="${name}"]`);
      allRadios.forEach(radio => {
        const radioValue = parseInt(radio.value);
        const label = this.querySelector(`label[for="${radio.id}"]`);
        
        if (radioValue <= selectedValue) {
          radio.classList.add('Filled');
        } else {
          radio.classList.remove('Filled');
        }
      });  
    }
  }
}

customElements.define('stat-rating', StatRating);
class DropdownSelect extends HTMLElement {
  constructor() {
    super();
    this.options = [];
  }

  static get observedAttributes() {
    return ['name', 'label', 'hidden', 'disabled', 'depends-on', 'api-path'];
  }

  connectedCallback() {
    this.render();
    const select = this.querySelector('select');
    const dependsOn = this.getAttribute('depends-on');
    
    if (dependsOn) {
      document.addEventListener('dropdown-changed', (e) => {
        if (e.detail.name === dependsOn) {
          this.handleDependencyChange(e.detail);
        }
      });
    }

    select.addEventListener('change', (e) => {
      const value = parseInt(e.target.value) || e.target.value;
      this.dispatchEvent(new CustomEvent('dropdown-changed', {
        detail: { 
          name: this.getAttribute('name'), 
          value: value,
          element: this 
        },
        bubbles: true
      }));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'label') {
      this.updateLabel();
    }
  }

  render() {
    const name = this.getAttribute('name') || '';
    const label = this.getAttribute('label') || '';
    const hidden = this.hasAttribute('empty');
    const disabled = this.hasAttribute('disabled');
    
    this.innerHTML = `
      <div class="sheet_trait-entry ${hidden ? 'Hidden' : ''} ${disabled ? 'Disabled' : ''}" id="${name}_field">
        <label class="sheet_stat-name" id="${name}_dropdown_label" for="${name}_dropdown">${label}</label>
        <select 
          class="sheet_stat-selection"
          id="${name}_dropdown"
          name="${name}"
        >
        </select>
      </div>
    `;
  }

  async handleDependencyChange(parentDetail) {
    this.setOptions([]);
    this.clearChildDropdowns();
    this.updateLabelFromParent(parentDetail);
  }

  clearChildDropdowns() {
    const myName = this.getAttribute('name');
    const childDropdowns = document.querySelectorAll(`character-dropdown[depends-on="${myName}"]`);
    childDropdowns.forEach(child => child.setOptions([]));
  }

  updateLabelFromParent(parentDetail) {

    if (parentDetail.name === 'template') {
      if (window.state?.monsterMap) {
        const monsterName = window.state.monsterMap.get(parentDetail.value);
        const labelMap = window.monsterTypeLabelMap?.[monsterName];       
        if (labelMap) {
          const myName = this.getAttribute('name');
          console.log(myName)
          switch (true) {
            case myName === 'monster_type' && !!labelMap[0]:
              this.updateLabel(labelMap[0]);
              break;
            case myName === 'monster_subtype' && !!labelMap[1]:
              this.updateLabel(labelMap[1]);
              break;
            case myName === 'powers' && !!labelMap[2]:
              this.updateLabel(labelMap[2]);
              break;
            default:
              break;
          }
        }
      }
    }

  }

  updateLabel(newLabel = null) {
    const label = newLabel || this.getAttribute('label');
    const labelElement = this.querySelector('.sheet_stat-name');
    if (labelElement) {
      labelElement.textContent = label;
    }
  }

  setOptions(options) {
    this.options = options;
    const select = this.querySelector('select');
    const container = this.querySelector('.sheet_trait-entry');
    
    select.innerHTML = '';
    
    container.classList.remove('Hidden', 'Disabled');
    
    if (options.length === 0) {
      container.classList.add('Hidden');
      return;
    }

    const placeholder = document.createElement('option');
    placeholder.value = 'pending';
    placeholder.text = 'None';
    placeholder.selected = true;
    placeholder.disabled = !!this.getAttribute('required');
    select.appendChild(placeholder);
    options.forEach(option => this.addOption(option));
  }

  addOption(option) {
    const select = this.querySelector('select');
    const newOption = document.createElement('option');
    newOption.value = option.id;
    newOption.text = option.name;
    select.appendChild(newOption);
  }

  show() {
    this.removeAttribute('empty');
    this.querySelector('.sheet_trait-entry').classList.remove('Hidden');
  }

  enable() {
    // this.removeAttribute('disabled');
    this.querySelector('.sheet_trait-entry').classList.remove('Disabled');
  }

  hide() {
    this.setAttribute('empty', true);
    this.querySelector('.sheet_trait-entry').classList.add('Hidden');
  }

  disable() {
    // this.setAttribute('disabled');
    this.querySelector('.sheet_trait-entry').classList.add('Disabled');
  }

  getValue() {
    const selectValue = this.querySelector('select').value;
    return selectValue ? (parseInt(selectValue) || selectValue) : null;
  }

  setValue(val) {
    this.querySelector('select').value = val;
  }

  async loadOptions(apiCall) {
    try {
      const options = await apiCall();
      if (options && options.length > 0) {
        this.setOptions(options);
        this.show();
      } else {
        this.setOptions([]);
        this.hide();
      }
    } catch (error) {
      console.error(`Error loading options for ${this.getAttribute('name')}:`, error);
      this.setOptions([]);
    }
  }
}
customElements.define('dropdown-select', DropdownSelect);
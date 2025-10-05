
interface Stat {
  id: number;
  name: string;
}

interface DropdownSelectElement extends HTMLElement {
  setOptions(options: Array<{ id: number; name: string }>): void;
  addOption(option: { id: number; name: string }): void;
  loadOptions(apiCall: () => Promise<unknown[]>): Promise<void>;
  value: number | string | null;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
}

interface StatRatingElement extends HTMLElement {
  setValue(value: number): void;
  getValue(): number;
  show(): void;
  hide(): void;
}

interface StatColumnElement extends HTMLElement {
  build(stats: Stat[], hidden?: boolean, removable?: boolean): void;
  calculateTotal(): void;
  render(): void;
  total: number;
  floor: number;
  max?: number;
}

interface SpendablePoolElement extends HTMLElement {
  setValue(value: number): void;
  getValue(): number;
  setMax(max: number): void;
  show(): void;
  hide(): void;
}

interface StatSectionElement extends HTMLElement {
  calculateTotal(): void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dropdown-select': React.DetailedHTMLProps<React.HTMLAttributes<DropdownSelectElement>, DropdownSelectElement> & {
        name?: string;
        label?: string;
        empty?: string;
        disabled?: string;
        'depends-on'?: string;
        'api-path'?: string;
      };
      'stat-rating': React.DetailedHTMLProps<React.HTMLAttributes<StatRatingElement>, StatRatingElement> & {
        name?: string;
        displayname?: string;
        value?: string | number;
        ceiling?: string | number;
        min?: string | number;
        max?: string | number;
        empty?: string;
        disabled?: string;
        removable?: string;
      };
      'stat-column': React.DetailedHTMLProps<React.HTMLAttributes<StatColumnElement>, StatColumnElement> & {
        name?: string;
        displayname?: string;
        floor?: string | number;
        max?: string | number;
      };
      'spendable-pool': React.DetailedHTMLProps<React.HTMLAttributes<SpendablePoolElement>, SpendablePoolElement> & {
        name?: string;
        displayname?: string;
        rating?: string | number;
        value?: string | number;
        min?: string | number;
        max?: string | number;
        removable?: string;
        empty?: string;
      };
      'stat-section': React.DetailedHTMLProps<React.HTMLAttributes<StatSectionElement>, StatSectionElement> & {
        name?: string;
        displayname?: string;
      };
    }
  }
}

export {};
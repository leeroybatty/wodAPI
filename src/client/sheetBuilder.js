class SheetBuilder {
  constructor() {
    const state = {
      year: 2025,
      books: [],
      exclude: {},
      monsterTypes: [],
      backgroundsMap: new Map(),
      monsterMap: new Map(),
      sheet: {
        abilities: {
          talents: [],
          skills: [],
          knowledges: []
        },
        backgrounds: new Map()
      }
    };
    this.state = state;
    this.listeners = new Map();
  }

  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.notify(key, value, oldValue);
    return value;
  }

  get(key) {
    return this.state[key];
  }

  update(updates) {
    Object.keys(updates).forEach(key => {
      this.set(key, updates[key]);
    });
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key, callback) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      this.listeners.set(key, callbacks.filter(cb => cb !== callback));
    }
  }

  notify(key, newValue, oldValue) {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach(cb => cb(newValue, oldValue));
  }

  updateMonsterMap(newEntries) {
    const newMap = new Map(
      newEntries.map(row => [row.id, row.name.toLowerCase()])
    );
    this.state.monsterMap = new Map([...this.state.monsterMap, ...newMap]);
    this.notify('monsterMap', this.state.monsterMap);
  }

  getMonsterName(id) {
    return this.state.monsterMap.get(id);
  }

}

window.SheetBuilder = new SheetBuilder();
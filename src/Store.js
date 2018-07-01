const store = {};

// TODO use actual state management

export default {
  set(key, value) {
    store[key] = value;
  },
  get(key) {
    return store[key];
  },
  has(key) {
    return store.hasOwnProperty(key);
  },
  remove(key) {
    delete store[key];
  }
}
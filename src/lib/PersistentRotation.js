export default {
  cache: [],
  getKey(index, length) {
    return Math.max(length - index - 1, 0);
  },
  hasKey(key) {
    return this.cache.length > key;
  },
  // Get a stack rotation for a given card
  getRotation(index, length) {
    const key = this.getKey(index, length);
    if(this.hasKey(key)) {
      console.log('hasKey' + key);
      return this.cache[key];
    }
    else {
      console.log('no hasKey' + key);
      const rotation = this.getRandomInt(-45, 45) + 'deg';
      this.cache[key] = rotation;
      return rotation;
    }
  },
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

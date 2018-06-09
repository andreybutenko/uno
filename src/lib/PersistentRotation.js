export default {
  cache: {},
  hasKey(key) {
    return Object.keys(this.cache).indexOf(key) > -1;
  },
  hash(card) {
    return card.type + '-' + card.color;
  },
  // Get a stack rotation for a given card
  getRotation(card) {
    const hash = this.hash(card);
    if(this.hasKey(hash)) {
      return this.cache[hash];
    }
    else {
      const rotation = this.getRandomInt(-45, 45) + 'deg';
      this.cache[hash] = rotation;
      return rotation;
    }
  },
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

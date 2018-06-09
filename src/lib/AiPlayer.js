import Rules from './Rules';
export default {
  makeMove: function(deck, manualColor, topCard) {
    let validMoves = deck.filter(card => Rules.isLegal(topCard, manualColor, card));
    let preferredMoves = validMoves.filter(card => card.type != 'special');
    if(preferredMoves.length > 0) {
      return this.chooseRandom(preferredMoves);
    }
    else if(validMoves.length > 0) {
      return this.chooseRandom(validMoves);
    }
    else {
      return false;
    }
  },
  chooseRandom: function(deck) {
    return deck[Math.floor(Math.random() * deck.length)];
  }
}

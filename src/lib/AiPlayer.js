import Rules from './Rules';
export default {
  animationConfig: {
    searchDelay: 150,
    selectDelay: 250
  },
  // Make a move procedurally, enabling pretty animations
  makeMove: function(hand, manualColor, topCard, setSelectedCard, drawCard, chooseCard) {
    const validIndices = [];
    const preferredIndices = [];

    const selectStep = () => {
      let selectedCardIndex;

      if(preferredIndices.length > 0) {
        selectedCardIndex = this.chooseRandom(preferredIndices);
      }
      else if(validIndices.length > 0) {
        selectedCardIndex = this.chooseRandom(validIndices);
      }

      setSelectedCard(selectedCardIndex);
      setTimeout(() => chooseCard(hand[selectedCardIndex]), this.animationConfig.selectDelay);
    }

    const searchStep = i => () => {
      setSelectedCard(i);

      if(Rules.isLegal(topCard, manualColor, hand[i])) {
        validIndices.push(i);

        if(hand[i].color != 'special') {
          preferredIndices.push(i);
        }
      }

      if(i == hand.length - 1 && validIndices.length == 0) {
        drawCard();
        setTimeout(searchStep(i + 1), this.animationConfig.searchDelay);
      }
      else if(i == hand.length - 1 && validIndices.length > 0) {
        setTimeout(selectStep, this.animationConfig.searchDelay);
      }
      else {
        setTimeout(searchStep(i + 1), this.animationConfig.searchDelay);
      }
    }

    searchStep(0)();
  },
  // Returns a card to play given a player's hand, the manualColor of the field, and the topCard of the field
  makeMoveBasic: function(deck, manualColor, topCard) {
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
  chooseRandom: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

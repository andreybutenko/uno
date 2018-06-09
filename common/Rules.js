export default {
  // Determines if a move is legal
  //   topCard: top card of the current stack
  //   card: proposed next move
  isLegal: function(topCard, manualColor, card) {
    if(topCard.color == 'special') {
      return card.color == 'special' || card.color == manualColor;
    }
    else {
      return card.color == 'special' || topCard.type == card.type || topCard.color == card.color;
    }
  }
}

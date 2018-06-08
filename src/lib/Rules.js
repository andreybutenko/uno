export default {
  // Determines if a move is legal
  //   topCard: top card of the current stack
  //   card: proposed next move
  isLegal: function(topCard, card) {
    return card.color == 'special' || topCard.color == 'special' || topCard.type == card.type || topCard.color == card.color;
  }
}

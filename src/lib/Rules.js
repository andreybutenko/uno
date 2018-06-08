export default {
  isLegal: function(topCard, card) {
    return card.color == 'special' || topCard.type == card.type || topCard.color == card.color;
  }
}

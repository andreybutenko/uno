import DeckBuilder from './DeckBuilder';

export default {
  generateHandWithLength: length => {
    const hand = [];
    for(let i = 0; i < length; i++) {
      hand.push(DeckBuilder.createCard('special', 'wild+4'));
    }
    return hand;
  },

  getMaskedState: (uno, playerId) => {
    return {
      boardDirection: uno.boardDirection,
      currentPlayer: uno.currentPlayer,
      deck: [],
      manualColor: uno.manualColor,
      players: uno.players.map(player => {
        const mask = playerId != player.id;
        console.log(player.id, player.selectedCardIndex)
        return {
          hand: mask ?
            this.default.generateHandWithLength(player.hand.length) :
            player.hand,
          human: player.human,
          id: player.id,
          name: player.name,
          selectedCardIndex: player.selectedCardIndex
        }
      }),
      stack: uno.stack
    };
  },

  apply: (uno, state) => {
    uno.boardDirection = state.boardDirection;
    uno.currentPlayer = state.currentPlayer;
    uno.deck = state.deck;
    uno.manualColor = state.manualColor;
    console.log(state.players.map(player => player.name));
    uno.players = state.players.map((player, i) => {
      return {
        hand: player.hand,
        human: player.human,
        id: player.id,
        name: player.name,
        selectedCardIndex: player.selectedCardIndex,
        remote: uno.players[i].remote
      }
    });
    uno.stack = state.stack;
  }
}
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
        return {
          hand: mask ?
            this.default.generateHandWithLength(player.hand.length) :
            player.hand,
          human: player.human,
          id: player.id,
          name: player.name,
          selectedCardIndex: -1
        }
      }),
      stack: uno.stack
    };
  },

  apply: (uno, state) => {
    console.log('state', state);
    console.log('before', uno);
    uno.boardDirection = state.boardDirection;
    uno.currentPlayer = state.currentPlayer;
    uno.deck = state.deck;
    uno.manualColor = state.manualColor;
    uno.players = state.players.map((player, i) => {
      return {
        hand: player.hand,
        human: player.human,
        id: player.id,
        name: player.name,
        remote: uno.players[i].remote
      }
    });
    uno.stack = state.stack;
    console.log('after', uno);
  }
}
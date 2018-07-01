import DeckBuilder from './DeckBuilder';

export default {
  createPlayers: function(playerConfig, deck) {
    return playerConfig.map(player => {
      return {
        name: player.name,
        id: player.id,
        human: player.human,
        remote: player.remote,
        selectedCardIndex: -1,
        hand: DeckBuilder.createHand(deck)
      }
    });
  }
}

import DeckBuilder from './DeckBuilder';
import Helper from './Helper';
import Players from './Players';
import Rules from './Rules';

export default {
  setup: function(playerConfig) {
    playerConfig = [
      {
        name: 'Andrey',
        human: true,
        remote: false
      },
      {
        name: 'Bot 1',
        human: false,
        remote: false
      },
      {
        name: 'Bot 2',
        human: false,
        remote: false
      }
    ];

    const deck = DeckBuilder.createDeck();
    DeckBuilder.shuffleDeck(deck);

    const top = DeckBuilder.getTop(deck);
    const field = [top.card];
    deck.splice(top.index, 1);

    const players = Players.createPlayers(playerConfig, deck);

    return {
      deck: deck,
      field: field,
      players: players
    }
  },

  playCard: function(player, card, players, gameState, env) {
    if(Rules.isLegal(gameState.field[0], gameState.manualColor, card)) {
      gameState.field.unshift(card);

      let spliceIndex = Helper.getPlayer(player, players).hand.indexOf(card);
      Helper.getPlayer(player, players).hand.splice(spliceIndex, 1);

      if(this.playSideEffects(player, card, players, gameState, env) === true) return;

      env.nextTurn();
    }
  },

  playSideEffects(player, card, players, gameState, env) {
    if(card.type == 'skip') {
      env.nextTurn();
    }
    if(card.type == 'reverse') {
      gameState.boardDirection *= -1;
    }
    if(card.type == '+2') {
      env.drawNextPlayer(2);
    }
    if(card.type == 'wild+4') {
      env.drawNextPlayer(4);
    }
    if(card.type == 'wild' || card.type == 'wild+4') {
      if(Helper.getPlayer(player, players).human === false &&
        Helper.getPlayer(player, players).remote === false) {
        const colors = ['red', 'yellow', 'green', 'blue'];
        gameState.manualColor = colors[Math.floor(Math.random() * colors.length)];
      }
      else {
        this.gameState.manualColor = null;
        this.needColor = true;
        return true;
      }
    }
  }

  draw(player, players, deck, n = 1) {
    for(let i = 0; i < n; i++) {
      const drawIndex = Math.floor(Math.random() * deck.length);
      Helper.getPlayer(player, players).hand.push(deck[drawIndex]);
      deck.splice(drawIndex, 1);
    }
  }
}

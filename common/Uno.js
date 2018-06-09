import DeckBuilder from './DeckBuilder';
import Helper from './Helper';
import Players from './Players';
import Rules from './Rules';

export default class {
  constructor(playerConfig, emit) {
    const deck = DeckBuilder.createDeck();
    DeckBuilder.shuffleDeck(deck);

    const top = DeckBuilder.getTop(deck);
    deck.splice(top.index, 1);

    this.deck = deck;
    this.stack = [top.card];
    this.players = Players.createPlayers(playerConfig, deck);
    this.boardDirection = +1;
    this.manualColor = null;
    this.currentPlayer = this.players[0].name;

    this.emit = emit;
  }

  get topStack() {
    return this.stack[0];
  }

  get playerList() {
    return this.players.map(player => player.name);
  }

  get nextPlayer() {
    let nextIndex = this.playerList.indexOf(this.currentPlayer) + this.boardDirection;
    if(nextIndex >= this.playerList.length) nextIndex = 0;
    else if(nextIndex < 0)  nextIndex = this.playerList.length - 1;
    return this.playerList[nextIndex];
  }

  getPlayer(name) {
    return this.players.filter(player => player.name == name)[0] || {};
  }

  playCard(player, card) {
    if(Rules.isLegal(this.topStack, this.manualColor, card)) {
      this.stack.unshift(card);

      let spliceIndex = this.getPlayer(player).hand.indexOf(card);
      this.getPlayer(player).hand.splice(spliceIndex, 1);

      if(this.playSideEffects(player, card) === true) return;

      this.nextTurn();
    }
  }

  playSideEffects(player, card) {
    if(card.type == 'skip') {
      this.nextTurn();
    }
    if(card.type == 'reverse') {
      this.boardDirection *= -1;
    }
    if(card.type == '+2') {
      this.draw(this.nextPlayer, 2);
    }
    if(card.type == 'wild+4') {
      this.draw(this.nextPlayer, 4);
    }
    if(card.type == 'wild' || card.type == 'wild+4') {
      if(this.getPlayer(player).human === false &&
        this.getPlayer(player).remote === false) {
        const colors = ['red', 'yellow', 'green', 'blue'];
        this.manualColor = colors[Math.floor(Math.random() * colors.length)];
      }
      else {
        this.manualColor = null;
        this.emit('needColor');
        return true;
      }
    }
  }

  setManualColor(color) {
    this.manualColor = color;
    this.nextTurn();
  }

  draw(player, n = 1) {
    for(let i = 0; i < n; i++) {
      const drawIndex = Math.floor(Math.random() * this.deck.length);
      this.getPlayer(player).hand.push(this.deck[drawIndex]);
      this.deck.splice(drawIndex, 1);
    }
  }

  nextTurn() {
    this.currentPlayer = this.nextPlayer;
  }
}

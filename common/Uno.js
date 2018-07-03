import DeckBuilder from './DeckBuilder';
import Players from './Players';
import Rules from './Rules';
import UnoState from './UnoState';

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
    this.currentPlayer = this.players[0].id;

    this.emit = emit;
  }

  get topStack() {
    return this.stack[0];
  }

  getPlayers() {
    return this.players;
  }

  get playerList() {
    return this.players.map(player => player.id);
  }

  get nextPlayer() {
    let nextIndex = this.playerList.indexOf(this.currentPlayer) + this.boardDirection;
    if(nextIndex >= this.playerList.length) nextIndex = 0;
    else if(nextIndex < 0)  nextIndex = this.playerList.length - 1;
    return this.playerList[nextIndex];
  }

  getPlayer(playerId) {
    return this.players.filter(player => player.id == playerId)[0] || {};
  }

  playCard(playerId, card) {
    if(Rules.isLegal(this.topStack, this.manualColor, card)) {
      this.stack.unshift(card);

      let spliceIndex = DeckBuilder.indexOf(this.getPlayer(playerId).hand, card);
      this.getPlayer(playerId).hand.splice(spliceIndex, 1);

      if(this.playSideEffects(playerId, card) === true) return;

      this.nextTurn();
    }
  }

  playSideEffects(playerId, card) {
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
      if(this.getPlayer(playerId).human === false &&
        this.getPlayer(playerId).remote === false) {
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

  draw(playerId, n = 1) {
    for(let i = 0; i < n; i++) {
      const drawIndex = Math.floor(Math.random() * this.deck.length);
      this.getPlayer(playerId).hand.push(this.deck[drawIndex]);
      this.deck.splice(drawIndex, 1);
    }
  }

  nextTurn() {
    this.currentPlayer = this.nextPlayer;
  }

  remoteSetState(unoState) {
    UnoState.apply(this, unoState);
  }

  remoteSetPlayerHand(id, hand) {
    this.getPlayer(id).hand = hand;
  }

  remoteSetPlayerHandLength(id, length) {
    this.getPlayer(id).hand = UnoState.generateHandWithLength(length);
  }

  remoteSetPlayerSelectedCardIndex(id, index)  {
    this.getPlayer(id).selectedCardIndex = index;
  }

  remoteSetCurrentPlayer(id) {
    this.currentId = id;
  }

  remoteSetBoardDirection(direction) {
    this.boardDirection = direction;
  }

  remoteSetManualColor(color) {
    this.manualColor = color;
  }

  remoteSetStack(stack) {
    this.stack = stack;
  }
}

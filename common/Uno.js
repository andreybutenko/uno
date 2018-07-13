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
    this.secondaryDeck = [];
    this.stack = [top.card];
    this.players = Players.createPlayers(playerConfig, deck);
    this.boardDirection = +1;
    this.manualColor = null;
    this.currentPlayer = this.players[0].id;
    this.nextQueued = false;

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
      this.secondaryDeck.push(card);

      let spliceIndex = DeckBuilder.indexOf(this.getPlayer(playerId).hand, card);
      this.getPlayer(playerId).hand.splice(spliceIndex, 1);

      if(this.playSideEffects(playerId, card) === true) return;

      this.nextTurn();
    }
  }

  playSideEffects(playerId, card) {
    if(card.type == 'skip') {
      this.nextTurn(true);
    }
    if(card.type == 'reverse') {
      this.boardDirection *= -1;
      if(this.players.length == 2) {
        this.nextTurn(true);
      }
    }
    if(card.type == '+2') {
      this.draw(this.nextPlayer, 2);
      this.nextTurn(true);
    }
    if(card.type == 'wild' || card.type == 'wild+4') {
      this.manualColor = null;

      if(card.type == 'wild+4') {
        this.draw(this.nextPlayer, 4);
        this.nextTurn(true, true); // TODO verify still works on multiplayer
      }
      
      this.emit('needColor');

      return true;
    }
  }

  setManualColor(color) {
    this.manualColor = color;
    this.nextTurn();
  }

  draw(playerId, n = 1) {
    if(this.deck.length < n) {
      DeckBuilder.shuffleDeck(this.secondaryDeck);
      
      for(let i = 0; i < this.secondaryDeck.length; i++) {
        this.deck.unshift(this.secondaryDeck[i]);
      }

      this.secondaryDeck = [];
    }

    for(let i = 0; i < n; i++) {
      const drawIndex = Math.floor(Math.random() * this.deck.length);
      this.getPlayer(playerId).hand.push(this.deck[drawIndex]);
      this.deck.splice(drawIndex, 1);
    }
  }

  nextTurn(isEffect = false, delayUntilNextCall = false) {
    if(this.nextQueued) {
      this.nextQueued = false;
      this.nextTurn(true);
    }

    if(delayUntilNextCall) {
      this.nextQueued = true;
      return;
    }

    if(this.getPlayer(this.currentPlayer).hand.length == 0) {
      this.emit('win', this.currentPlayer);
      this.currentPlayer = null;
      return;
    }

    this.currentPlayer = this.nextPlayer;

    if(!isEffect) {
      this.emit('nextTurn');
    }
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

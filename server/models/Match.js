import BotConnection from './BotConnection';
import Connection from './Connection';

import AiPlayer from '../../common/AiPlayer';
import { generateId } from '../../common/IdGenerator';
import PlayerAdapter from '../../common/PlayerAdapter';
import Uno from '../../common/Uno';
import UnoState from '../../common/UnoState';

let matches = [];

export default class Match {
  constructor(name) {
    this.name = name;
    this.id = generateId();
    this.players = [];
    this.running = false;
    this.uno = null;
    this.waitingForInputFrom = null;
    this.waitingForUserInput = false;

    matches.push(this);
  }

  toParcel() {
    return {
      ...this,
      id: this.id,
      encodedName: this.getEncodedName(),
      players: this.players.map((player, index) => {
        return {
          ...player,
          index: index,
          player: !player.open ? player.player.toParcel() : null
        }
      })
    }
  }

  getId() {
    return this.id;
  }

  getEncodedName() {
    return this.name.replace(/\W/g, '');
  }

  isEmpty() {
    return this.players.filter(player => player.human && !player.open).length == 0;
  }

  isRunning() {
    return this.running;
  }

  startGame() {
    this.running = true;
    this.uno = new Uno(PlayerAdapter.toGame(this.players, 'server'), this.onGameEmit.bind(this));
    this.emitUpdate();
    this.emitAll('startGame');
    this.emitUnoUpdateAll();
  }

  onGameEmit(event, data) {
    if(event == 'needColor' && this.getCurrentPlayer().human) {
      this.waitingForInputFrom = this.getCurrentPlayer().player.getId();
      this.waitingForUserInput = true;
      this.getCurrentPlayer().player.emit('onGameEmit', event);
    }
    else if(event == 'needColor' && !this.getCurrentPlayer().human) {
      this.onUserSelectColor(AiPlayer.selectColor(this.getUno().getPlayer(this.getUno().currentPlayer).hand));
    }
    else if(event == 'win') {
      this.emitAll('onWin', data);
      this.emitUnoUpdateAll();
    }
    else if(event == 'nextTurn') {
      if(!this.getCurrentPlayer().human) {
        const uno = this.getUno();
        const player = uno.getPlayer(uno.currentPlayer);

        const setSelectedCard = index => {
          player.selectedCardIndex = index;
          this.emitUnoUpdateAll();
        }
        const drawCard = () => {
          uno.draw(player.id);
          this.emitUnoUpdateAll();
        }
        const chooseCard = card => {
          setSelectedCard(-1);
          uno.playCard(player.id, card);
          this.emitUnoUpdateAll();
        }

        AiPlayer.makeMove(
          player.hand,
          uno.manualColor,
          uno.topStack,
          setSelectedCard,
          drawCard,
          chooseCard
        );
      }
    }
  }

  onUserHighlightCard(id, index) {
    this.getUno().getPlayer(id).selectedCardIndex = index;
    this.emitUnoUpdateAll();
  }

  onUserSelectColor(color) {
    this.waitingForInputFrom = null;
    this.waitingForUserInput = false;
    this.getUno().setManualColor(color);
    this.emitUnoUpdateAll();
  }

  getCurrentPlayer() {
    return this.getPlayer(this.getUno().currentPlayer);
  }

  getUno() {
    return this.uno;
  }

  isPlayerTurn(id) {
    return this.getUno().currentPlayer == id;
  }

  isWaitingForUserInput() {
    return this.waitingForUserInput;
  }

  isWaitingForInputFrom(id) {
    return this.waitingForInputFrom == id;
  }

  emitUnoUpdate(connection) {
    connection.emit('unoStateUpdate', UnoState.getMaskedState(this.uno, connection.getId()));
  }

  emitUnoUpdateAll() {
    this.players
      .filter(player => player.human && !player.open)
      .forEach(player => this.emitUnoUpdate(player.player));
  }

  addHumanSlot() {
    this.players.push({
      open: true,
      human: true
    });

    this.emitUpdate();
  }

  addBotSlot() {
    this.players.push({
      open: false,
      human: false,
      player: new BotConnection()
    });

    this.emitUpdate();
  }

  addHumanPlayer(connection, isAdmin) {
    if(this.hasSpace()) {
      this.players[this.getFirstOpenSpace()] = {
        open: false,
        human: true,
        admin: isAdmin,
        player: connection
      };

      connection.joinMatch(this.getId());
      connection.emit('joinMatch', this.toParcel());

      this.emitUpdate();

      return false;
    }
    return true;
  }

  removePlayer(playerId) {
    const result = this.players
      .map((player, index) => { return { ...player, index: index }})
      .filter(player => player.player && player.player.getId() == playerId)[0];
    
    if(result) {
      this.removePlayerAtIndex(result.index);
    }
  }

  removePlayerAtIndex(index) {
    const removePlayer = this.players[index];

    if(!this.running) {
      const isPresentHuman = removePlayer.human && !!removePlayer.player;

      this.players.splice(index, 1);

      if(isPresentHuman) {
        removePlayer.player.leaveMatch();
        this.addHumanSlot();
      }

      if(this.isEmpty()) {
        Match.remove(this.id);
      }

      if(this.getAdmins().length == 0) {
        this.players.filter(player => player.human)[0].admin = true;
      }
      
      this.emitUpdate();
    }
    else {
      removePlayer.human = false;
      this.getUno().getPlayer(removePlayer.player.id).human = false;
      this.emitUnoUpdateAll();
    }
  }

  getFirstOpenSpace() {
    const res = this.players
      .map((player, i) => { return { open: player.open, i: i }})
      .filter(player => player.open == true)
      .map(player => player.i)[0];
    return typeof res ==='undefined' ? -1 : res;
  }

  hasPlayer(connection) {
    return this.players.filter(player => player.player && player.player.getId() == connection.getId()).length > 0;
  }

  getPlayer(playerId) {
    return this.players.filter(player => player.player && player.player.getId() == playerId)[0];
  }

  getAdmins() {
    return this.players
      .filter(player => player.admin)
      .map(player => player.player.id);
  }

  hasSpace() {
    return this.getFirstOpenSpace() != -1;
  }

  rename(newName) {
    this.name = newName;
    this.emitUpdate();
  }

  sendMessage(sender, type, content) {
    this.emitAll('newMessage', {
      sender,
      type,
      content
    });
  }

  emitUpdate() {
    this.emitAll('onMatchUpdate', this.toParcel());
    Connection.emitAll('refreshMatches', Match.getOpenMatches());
  }

  emitAll(eventName, payload) {
    this.players
      .filter(player => player.human && !player.open)
      .forEach(player => player.player.emit(eventName, payload));
  }

  static remove(id) {
    matches = matches.filter(match => match.getId() != id);
  }

  static matchExists(id) {
    return matches.filter(match => match.getId() == id).length > 0;
  }

  static getOpenMatches() {
    return matches
      .filter(match => !match.running)
      .map(match => match.toParcel());
  }

  static getMatch(id) {
    return matches.filter(match => match.getId() == id)[0];
  }
}

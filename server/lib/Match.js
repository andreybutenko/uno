import BotConnection from './BotConnection';
import Connection from './Connection';

let matches = [];

export default class Match {
  constructor(name) {
    this.name = name;
    this.players = [];
    matches.push(this);
  }

  toParcel() {
    return {
      ...this,
      players: this.players.map((player, index) => {
        return {
          ...player,
          index: index,
          player: !player.open ? player.player.toParcel() : null
        }
      })
    }
  }

  isEmpty() {
    return this.players.filter(player => player.human && !player.open).length == 0;
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

      connection.joinMatch(this.name);
      connection.emit('joinMatch', this.toParcel());

      this.emitUpdate();

      return false;
    }
    return true;
  }

  removePlayer(connection) {
    console.log(this.players);
    const result = this.players
      .map((player, index) => { return { ...player, index: index }})
      .filter(player => player.player && player.player.getId() == connection.getId())[0];

    if(result) {
      this.removePlayerAtIndex(result.index);
    }
  }

  removePlayerAtIndex(index) {
    const removePlayer = this.players[index];
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

    this.players.forEach(player => {
      player.player.updateMatchName(newName);
    });

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

  static remove(matchId) {
    matches = matches.filter(match => match.id != matchId);
  }

  static matchExists(name) {
    return matches.filter(match => match.name == name).length > 0;
  }

  static getOpenMatches() {
    return matches
      .filter(match => !match.started)
      .map(match => match.toParcel());
  }

  static getMatch(name) {
    return matches.filter(match => match.name == name)[0];
  }
}

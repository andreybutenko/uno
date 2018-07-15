import { generateName } from '../../common/NameGenerator';
import Match from './Match.js';

let connections = [];

export default class Connection {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.name = generateName();
    this.matchId = null;

    this.socket.emit('onPlayerNameChange', this.name);
    this.socket.emit('setId', this.id);

    connections.push(this);
  }

  toParcel() {
    return {
      name: this.getName(),
      id: this.getId()
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
    this.socket.emit('onPlayerNameChange', name);
  }

  disconnect() {
    Connection.remove(this.id);
  }

  inMatch() {
    return this.matchId != null && typeof this.getMatch() !== 'undefined';
  }

  isMatchAdmin() {
    return this.getMatch().getAdmins().indexOf(this.getId()) > -1;
  }

  joinMatch(matchId) {
    console.log('joinMatch', matchId);
    this.matchId = matchId;
  }

  leaveMatch() {
    this.matchId = null;
    this.emit('leaveMatch');
  }

  getMatch() {
    return Match.getMatch(this.matchId);
  }

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }

  static usernameTaken(name) {
    return connections.filter(connection => connection.getName() == name).length > 0;
  }

  static emitAll(eventName, data) {
    connections.forEach(connection => {
      connection.emit(eventName, data);
    });
  }

  static remove(id) {
    connections = connections.filter(connection => connection.id != id);
  }

  static exists(id) {
    return connections.filter(connection => connection.id == id).length > 0;
  }

  static get(id) {
    return connections.filter(connection => connection.id == id)[0];
  }
}  
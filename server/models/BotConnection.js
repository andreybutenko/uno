import { generateName } from '../../common/NameGenerator';
import uniqid from 'uniqid';

export default class BotConnection {
  constructor() {
    this.id = uniqid();
    this.name = generateName();
  }

  toParcel() {
    return this;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  updateMatchName(){}
  emit(){}
}
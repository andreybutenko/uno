const validCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const characterArray = validCharacters.split('')
const ID_LENGTH = 4;

export function generateId(length = ID_LENGTH) {
  let result = '';
  for(let i = 0; i < length; i++) {
    result += characterArray[Math.floor(Math.random() * characterArray.length)];
  }
  return result;
}
import Connection from '../models/Connection';

export default {
  apply: (socket, connection) => {
    socket.on('setPlayerName', newName => {
      if(Connection.usernameTaken(newName))  {
        socket.emit('onError', 'Username ' + newName + ' is already taken!');
        return;
      }

      if(newName.length == 0) {
        socket.emit('onError', 'Username cannot be empty.');
        return;
      }

      if(newName.length > 30) {
        socket.emit('onError', 'Username cannot be more than 30 characters long.');
        return;
      }
  
      connection.setName(newName);
  
      if(connection.inMatch()) {
        connection.getMatch().emitUpdate();
      }
    });

    socket.on('newMessage', content => {
      if(!connection.inMatch()) {
        socket.emit('onError', 'You are not in a match');
        return;
      }

      if(content.length == 0) {
        socket.emit('onError', 'You cannot send an empty message.');
        return;
      }

      if(content.length > 20000) {
        socket.emit('onError', 'Your message is too long.');
        return;
      }
  
      connection.getMatch().sendMessage(connection.getName(), 'text', content);
    });
  }
}
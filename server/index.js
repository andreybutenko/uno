import Connection from './models/Connection.js';
import Match from './models/Match.js';

import Chat from './modules/Chat.js';
import Matchmaking from './modules/Matchmaking.js';
import Multiplayer from './modules/Multiplayer.js';

const io = require('socket.io')();

io.on('connection', function(socket) {
  const connection = new Connection(socket);
  console.log('a user connected');

  socket.emit('refreshMatches', Match.getOpenMatches());

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    connection.disconnect();
    if(connection.inMatch()) {
      connection.getMatch().removePlayer(connection);
    }
  });

  Chat.apply(socket, connection);
  Matchmaking.apply(socket, connection);
  Multiplayer.apply(socket, connection);
});

io.listen(3000);

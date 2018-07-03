import DeckBuilder from '../../common/DeckBuilder';

export default {
  apply: (socket, connection) => {
    socket.on('draw', () => {
      console.log('drawing...');

      if(!connection.inMatch() && !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      if(!connection.getMatch().isPlayerTurn(connection.getId())) {
        socket.emit('onError', 'It is not your turn.');
        return;
      }

      const match = connection.getMatch();
      const uno = match.getUno();
      const id = connection.getId();

      uno.draw(id);

      match.emitAll('setPlayerHandLength', { id, length: uno.getPlayer(id).hand.length });
      socket.emit('setPlayerHand', { id, hand: uno.getPlayer(id).hand });
    });

    socket.on('playCard', card => {
      console.log('drawing...');

      if(!connection.inMatch() && !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      if(!connection.getMatch().isPlayerTurn(connection.getId())) {
        socket.emit('onError', 'It is not your turn.');
        return;
      }

      const match = connection.getMatch();
      const uno = match.getUno();
      const id = connection.getId();

      if(DeckBuilder.indexOf(uno.getPlayer(id).hand, card) == -1) {
        socket.emit('onError', 'You do not have that card.');
        return;
      }

      uno.playCard(id, card);
      match.emitUnoUpdateAll();
    });

    socket.on('startGame', () => {
      if(!connection.inMatch())  {
        socket.emit('onError', 'You are not in a match.');
        return;
      }

      connection.getMatch().startGame();
    });

    socket.on('resyncGame', () => {
      if(!connection.inMatch() && !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      connection.getMatch().emitUnoUpdate(connection);
    })
  }
}
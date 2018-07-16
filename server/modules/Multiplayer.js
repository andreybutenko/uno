import DeckBuilder from '../../common/DeckBuilder';

export default {
  apply: (socket, connection) => {
    socket.on('draw', () => {
      console.log('drawing...');

      if(!connection.inMatch() || !connection.getMatch().isRunning())  {
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

      if(!connection.inMatch() || !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      if(!connection.getMatch().isPlayerTurn(connection.getId())) {
        socket.emit('onError', 'It is not your turn.');
        return;
      }

      if(connection.getMatch().isWaitingForUserInput()) {
        socket.emit('onError', 'You cannot play a card right now.');
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

    socket.on('userHighlightCard', index => {
      if(!connection.inMatch() || !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      if(!connection.getMatch().isPlayerTurn(connection.getId())) {
        socket.emit('onError', 'It is not your turn.');
        return;
      }

      connection.getMatch().onUserHighlightCard(connection.getId(), index);
    });

    socket.on('userSelectColor', color => {
      if(!connection.inMatch() || !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      if(!connection.getMatch().isWaitingForInputFrom(connection.getId())) {
        socket.emit('onError', 'You cannot select a color right now.');
        return;
      }

      if(DeckBuilder.deckConfig.colors.indexOf(color) == -1) {
        socket.emit('onError', 'That is not a valid color.');
        return;
      }

      connection.getMatch().onUserSelectColor(color);
    });

    socket.on('startGame', () => {
      if(!connection.inMatch())  {
        socket.emit('onError', 'You are not in a match.');
        return;
      }

      if(connection.getMatch().isRunning()) {
        socket.emit('onError', 'Game is already started.');
        return;
      }

      if(connection.getMatch().players.length == 1) {
        socket.emit('onError', 'You need more than one player to start the match.');
        return;
      }

      if(connection.getMatch().players.filter(player => player.open).length > 0) {
        socket.emit('onError', 'You cannot start a game with open slots.');
        return;
      }

      connection.getMatch().startGame();
    });

    socket.on('resyncGame', () => {
      if(!connection.inMatch() || !connection.getMatch().isRunning())  {
        socket.emit('onError', 'You are not in a running match.');
        return;
      }

      connection.getMatch().emitUnoUpdate(connection);
    })
  }
}
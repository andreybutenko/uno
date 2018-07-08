export default {
  toGame: (players, playerId) => {
    return players.map(player => {
      console.log(player, playerId);
      return {
        id: player.player.id,
        name: player.player.name,
        human: player.human,
        remote: player.hasOwnProperty('remote') ?
          player.remote :
          playerId != 'server' || player.player.id != playerId
      };
    });
  }
}
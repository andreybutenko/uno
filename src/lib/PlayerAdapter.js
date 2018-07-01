export default {
  toGame: (players, playerId) => {
    return players.map(player => {
      return {
        id: player.player.id,
        name: player.player.name,
        human: player.human,
        remote: false && player.player.id != playerId
      };
    });
  }
}
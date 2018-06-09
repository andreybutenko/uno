export default {
  getPlayer: function(name, players) {
    return players.filter(player => player.name == name)[0] || {};
  },
}

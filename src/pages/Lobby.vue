<template>
  <div class="lobby">
    <IntroCard />

    <PlayerDetail
      :playerName="playerName" />

    <MatchList
      :joinMatch="joinMatch"
      :createMatch="createMatch"
      :currentMatch="currentMatch" />

    <MatchView
      :playerId="playerId"
      :currentMatch="currentMatch"
      :messages="messages"
      :startGame="startGame"
      :leaveMatch="leaveMatch"
      :kickPlayer="kickPlayer"
      v-if="currentMatch != null" />
  </div>
</template>

<script>
  import IntroCard from '@/components/lobby/IntroCard';
  import MatchList from '@/components/lobby/MatchList';
  import MatchView from '@/components/lobby/MatchView';
  import PlayerDetail from '@/components/lobby/PlayerDetail';

  import PlayerAdapter from '@/../common/PlayerAdapter';
  import Store from '@/Store';

  export default {
    name: 'Lobby',
    components: { IntroCard, MatchList, MatchView, PlayerDetail },
    data() {
      return {
        playerName: 'A New Player',
        playerId: '',
        currentMatch: null,
        matches: [],
        messages: []
      }
    },
    mounted() {
      this.$socket.emit('refreshLobby');
    },
    sockets: {
      setId(id) {
        this.playerId = id;
      },
      refreshLobby({ playerName, playerId, matches }) {
        this.playerName = playerName;
        this.playerId = playerId;
        this.matches = matches;
      },
      startGame() {
        Store.set('players', PlayerAdapter.toGame(this.currentMatch.players, this.playerId));
        Store.set('playerId', this.playerId);

        this.$router.push({
          path: '/game'
        });
      },
      onPlayerNameChange(name) {
        this.playerName = name;
      },
      joinMatch(match) {
        this.currentMatch = match;
      },
      leaveMatch() {
        this.currentMatch = null;
      },
      onMatchUpdate(match) {
        this.currentMatch = match;
      },
      onError(text) {
        alert(text);
      }
    },
    methods: {
      startGame() {
        this.$socket.emit('startGame');
      },
      leaveMatch() {
        this.$socket.emit('leaveMatch');
      },
      joinMatch(match) {
        this.$socket.emit('joinMatch', match.name);
      },
      createMatch() {
        this.$socket.emit('createMatch', this.playerName + '\'s Game');
      },
      kickPlayer(index) {
        this.$socket.emit('kickPlayer', index);
      }
    }
  }
</script>

<style lang="scss">
  .lobby-ui {
    width: 500px;
    max-width: 100vw;
    border-radius: 16px;
    margin: 16px 0;
  }
</style>

<style lang="scss" scoped>
  .btn {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }

  .lobby {
    background-image: url('/static/james-connolly-363036-unsplash.jpg');
    background-size: cover;
    background-position: center;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

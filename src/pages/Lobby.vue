<template>
  <div class="lobby">
    <IntroCard />

    <PlayerDetail
      :playerName="playerName"
      :setName="setName" />

    <MatchList
      :joinMatch="joinMatch"
      :createMatch="createMatch"
      :currentMatch="currentMatch" />

    <MatchView
      :playerId="playerId"
      :playerName="playerName"
      :currentMatch="currentMatch"
      :messages="messages"
      :startGame="startGame"
      :leaveMatch="leaveMatch"
      :kickPlayer="kickPlayer"
      :addPlayerOffline="addPlayerOffline"
      :updateMatchNameOffline="updateMatchNameOffline"
      v-if="currentMatch != null" />
  </div>
</template>

<script>
  import IntroCard from '@/components/lobby/IntroCard';
  import MatchList from '@/components/lobby/MatchList';
  import MatchView from '@/components/lobby/MatchView';
  import PlayerDetail from '@/components/lobby/PlayerDetail';

  import { generateName } from '@/../common/NameGenerator';
  import PlayerAdapter from '@/../common/PlayerAdapter';
  import Store from '@/Store';

  export default {
    name: 'Lobby',
    components: { IntroCard, MatchList, MatchView, PlayerDetail },
    props: ['id'],
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
      if(this.$network.online) {
        this.$network.emit('refreshLobby');
      }
      else {
        this.setName(generateName());
      }

      if(this.id) {
        this.joinMatch(this.id);
      }
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
        this.gotoGameView();
      },
      onPlayerNameChange(name) {
        this.setName(name);
      },
      joinMatch(match) {
        this.currentMatch = match;

        if(this.$route.path.indexOf(match.id) == -1) {
          this.$router.push({ path: '/lobby/' + match.id });
        }
      },
      leaveMatch() {
        this.currentMatch = null;
        this.$router.push({ path: '/lobby/' });
      },
      onMatchUpdate(match) {
        this.currentMatch = match;
      },
      onError(text) {
        alert(text);
      }
    },
    methods: {
      setName(name) {
        this.playerName = name;
        if(this.$network.offline) {
          this.playerId = '[player]' + name;
        }
      },
      startGame() {
        if(this.$network.online) {
          this.$network.emit('startGame');
        }
        else {
          this.gotoGameView();
        }
      },
      gotoGameView() {
        Store.set('players', PlayerAdapter.toGame(this.currentMatch.players, this.playerId));
        Store.set('playerId', this.playerId);

        console.log('store player = ', PlayerAdapter.toGame(this.currentMatch.players, this.playerId));

        this.$router.push({
          path: this.$network.online ? '/game' : '/game/offline'
        });
      },
      leaveMatch() {
        if(this.$network.online) {
          this.$network.emit('leaveMatch');
        }
        else {
          this.currentMatch = null;
        }
      },
      joinMatch(matchId) {
        this.$router.push({ path: '/lobby/' + matchId });
        this.$network.emit('joinMatch', matchId);
      },
      createMatch() {
        if(this.$network.online) {
          this.$network.emit('createMatch', this.playerName + '\'s Game');
        }
        else {
          this.currentMatch = {
            name: this.playerName + '\'s Game',
            players: []
          };
          this.addPlayerOffline(this.playerName);
          for(let i = 0; i < 3; i++) {
            this.addPlayerOffline();
          }
        }
      },
      addPlayerOffline(name) {
        const isHuman = arguments.length == 1;
        const playerName = isHuman ? name : generateName();

        this.currentMatch.players.push({
          human: isHuman,
          remote: false,
          player: {
            name: playerName,
            id: (isHuman ? '[player]' : '[bot]') + playerName
          }
        })
      },
      updateMatchNameOffline(name) {
        this.currentMatch.name = name;
      },
      kickPlayer(index) {
        if(this.$network.online) {
          this.$network.emit('kickPlayer', index);
        }
        else {
          this.currentMatch.players.splice(index, 1);
        }
      }
    },
    watch: {
      $route (to, from) {
        if(to.name == 'In-Match Lobby' && from.name != 'In-Match Lobby') {
          this.joinMatch(to.params.id);
        }
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

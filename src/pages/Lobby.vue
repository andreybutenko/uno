<template>
  <div class="lobby">
    <div class="player">
      <h1>You</h1>

      <span v-if="ui.enablePlayerNameEdit == false">{{ playerName }} <button @click="editPlayerName()">Change Name</button></span>
      <span v-else><input v-model="ui.playerNameEdit" placeholder="User Name" /> <button @click="applyEditPlayerName()">Save Name</button></span>
    </div>

    <div class="match-find">
      <h1>Games</h1>

      <div class="match-list">
        <div class="item-match create-match" @click="createMatch()">
          <font-awesome-icon icon="plus-square" />

          <span class="label">Create a new match!</span>
        </div>
        <div v-for="match in matches" :key="match.name" class="item-match">
          <span class="name">{{ match.name }}</span>
          <span class="status">{{ getStatus(match) }}</span>
          <span class="spacer"></span>
          <button @click="joinMatch(match)">Join</button>
        </div>
      </div>
      
      <button @click="createMatch()">
        Create a Match
      </button>
    </div>
    <div class="match-admin" v-if="currentMatch != null">
      <h1>Your Match</h1>

      <span v-if="ui.enableMatchNameEdit == false">{{ currentMatch.name }} <button @click="editMatchName()" v-if="isMatchAdmin">Edit Match Name</button></span>
      <span v-else><input v-model="ui.matchNameEdit" placeholder="Match Name" /> <button @click="applyEditMatchName()">Save Match Name</button></span>

      <button @click="startGame()">Start Game</button>
      <button @click="leaveMatch()">Leave</button>

      <br/><br/>

      <div>
        <div v-for="(player, i) in sortedPlayers" :key="i">
          {{ !player.open ? player.player.name : 'Open' }} - {{ player.human ? 'Human' : 'Bot' }}{{ player.admin ? ' - Admin'  : '' }} <button @click="kickPlayer(player.index)" v-if="isMatchAdmin && (!player.human || !player.player || player.player.name != playerName)">Kick</button>
        </div>

        <button @click="addBotSlot()" v-if="isMatchAdmin">Add Bot</button>
        <button @click="addHumanSlot()" v-if="isMatchAdmin">Add Human</button>
      </div>

      <h1>Chat</h1>
      <div class="chat-box">
        <div v-for="(message, i) in messages" :key="i">
          <b>{{ message.sender }}</b> {{ message.content }}<br/>
        </div>
      </div>
      Send a message: <input v-model="ui.messageDraft" placeholder="" /> <button @click="sendMessage()">Send</button>
    </div>
  </div>
</template>

<script>
  import PlayerAdapter from '@/../common/PlayerAdapter';
  import Store from '@/Store';

  export default {
    name: 'Lobby',
    data() {
      return {
        playerName: 'A New Player',
        playerId: '',
        currentMatch: null,
        matches: [],
        messages: [],
        ui: {
          matchNameEdit: '',
          enableMatchNameEdit: false,
          playerNameEdit: '',
          enablePlayerNameEdit: false,
          messageDraft: ''
        }
      }
    },
    sockets: {
      setId(id) {
        this.playerId = id;
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
      refreshMatches(matches) {
        console.log('matches', matches);
        this.matches = matches;
      },
      joinMatch(match) {
        this.currentMatch = match;
      },
      leaveMatch() {
        this.currentMatch = null;
        this.refreshMatches();
      },
      onMatchUpdate(match) {
        console.log('match', match);
        this.currentMatch = match;
      },
      onError(text) {
        alert(text);
      },
      newMessage(payload) {
        this.messages.push(payload);
      }
    },
    methods: {
      startGame() {
        this.$socket.emit('startGame');
      },
      getStatus(match) {
        const numOpen = match.players.filter(player => player.open).length;
        const numSlots = match.players.length;
        if(numOpen == 0) {
          return 'Full';
        }
        else if(numOpen == 1) {
          return '1 slot open';
        }
        else {
          return numOpen + ' slots open';
        }
      },
      editPlayerName() {
        this.ui.playerNameEdit = this.playerName;
        this.ui.enablePlayerNameEdit = true;
      },
      applyEditPlayerName() {
        this.$socket.emit('setPlayerName', this.ui.playerNameEdit);
        this.ui.enablePlayerNameEdit = false;
      },
      editMatchName() {
        this.ui.matchNameEdit = this.currentMatch.name;
        this.ui.enableMatchNameEdit = true;
      },
      applyEditMatchName() {
        this.$socket.emit('updateMatchName', this.ui.matchNameEdit);
        this.ui.enableMatchNameEdit = false;
      },
      leaveMatch() {
        this.$socket.emit('leaveMatch');
      },
      joinMatch(match) {
        this.$socket.emit('joinMatch', match.name);
      },
      addHumanSlot() {
        this.$socket.emit('addHumanSlot');
      },
      addBotSlot() {
        this.$socket.emit('addBotSlot');
      },
      createMatch() {
        this.$socket.emit('createMatch', this.playerName + '\'s Game');
      },
      refreshMatches() {
        this.$socket.emit('refreshMatches');
      },
      kickPlayer(index) {
        this.$socket.emit('kickPlayer', index);
      },
      sendMessage() {
        this.$socket.emit('newMessage', this.ui.messageDraft);
        this.ui.messageDraft = '';
      }
    },
    computed: {
      sortedPlayers() {
        const res = [];
        res.push(...this.currentMatch.players.filter(player => player.human && !player.open));
        res.push(...this.currentMatch.players.filter(player => player.human && player.open));
        res.push(...this.currentMatch.players.filter(player => !player.human));
        return res;
      },
      isMatchAdmin() {
        return this.currentMatch != null && this.currentMatch.players.filter(player => player.player && player.player.id == this.playerId)[0].admin;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }

  .chat-box {
    height: 200px;
    border: 1px solid black;
    overflow-y: scroll;
  }

  .match-find {
    width: 500px;
    max-width: 100vw;
    background-color: #F22613;

    .match-list {
      margin: 16px;
      border-radius: 8px;
      background-color: white;

      .item-match.create-match {
        font-size: 20px;
        padding: 24px;
        justify-content: center;
        align-items: center;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        cursor: pointer;
        transition: all 250ms;

        svg, path {
          height: 20px;
          width: 20px;
        }

        .label {
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 250ms;
          vertical-align: text-bottom;
        }

        &:hover {
          background-color: #bdc3c7;

          .label {
            max-width: 500px;
            padding-left: 16px;
          }
        }
      }

      .item-match {
        border-top: 1px solid black;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: default;
        user-select: none;

        &:first-of-type {
          border-top: 0;

          button {
            border-top-right-radius: 8px;
          }
        }

        &:last-of-type {
          button {
            border-bottom-right-radius: 8px;
          }
        }

        .name {
          font-family: 'Wendy One', sans-serif;
          font-size: 20px;
          padding: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status {
          background-color: #ecf0f1;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          padding: 4px 8px;
          margin-right: 16px;
          white-space: nowrap;
        }

        .spacer {
          flex: 1;
        }

        button {
          font-family: 'Source Sans Pro', sans-serif;
          font-weight: 800;
          background-color: #2ecc71;
          border: 0;
          border-left: 1px solid black;
          padding: 8px 32px;
          align-self: stretch;
          text-transform: uppercase;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 250ms;

          &:hover {
            background-color: #65ed9f;
          }
        }
      }
    }
  }
</style>

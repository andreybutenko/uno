<template>
  <div class="match-admin-container">
    <div class="match-admin">
      <h1>Your Match</h1>

      <template v-if="nameEditEnabled == false">
        <div class="name"><b>Match Name:</b> {{ currentMatch.name }}</div>
        <div class="center-button">
          <button @click="editName()" class="vbtn" v-if="isMatchAdmin">Edit Name</button>
        </div>
      </template>
      <template v-else>
        <input class="name-edit" v-model="nameEdit" placeholder="Match Name" />
        <div class="center-button">
          <button @click="applyEdit()" class="vbtn">Save Name</button>
        </div>
      </template>

      <div class="center-button">
        <button @click="startGame()" class="vbtn vbtn-green">Start Game</button>
        <button @click="leaveMatch()" class="vbtn">Leave</button>
      </div>

      <div>
        <div class="player-list">
          <div v-for="(player, i) in sortedPlayers" :key="i">
            {{ !player.open ? player.player.name : 'Open' }} - {{ player.human ? 'Human' : 'Bot' }}{{ player.admin ? ' - Admin'  : '' }} <button @click="kickPlayer(player.index)" v-if="isMatchAdmin && (!player.human || !player.player || player.player.id != playerId)">Kick</button>
          </div>
        </div>

        <div class="center-button">
          <button @click="addBotSlot()" class="vbtn" v-if="isMatchAdmin">Add Bot</button>
          <button @click="addHumanSlot()" class="vbtn" v-if="isMatchAdmin">Add Human</button>
        </div>
      </div>

      <h1 class="chat-header">Chat</h1>
      <div class="chat-box">
        <div v-for="(message, i) in messages" :key="i">
          <b>{{ message.sender }}</b> {{ message.content }}<br/>
        </div>
      </div>
      Send a message: <input v-model="messageDraft" placeholder="" /> <button @click="sendMessage()" class="vbtn">Send</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MatchView',
    props: ['playerId', 'currentMatch', 'messages', 'startGame', 'leaveMatch', 'kickPlayer', 'sendMessage'],
    data() {
      return {
        nameEdit: '',
        nameEditEnabled: false,
        messageDraft: ''
      };
    },
    methods: {
      editName() {
        this.nameEdit = this.playerName;
        this.nameEditEnabled = true;
      },
      applyEdit() {
        this.$socket.emit('updateMatchName', this.nameEdit);
        this.nameEditEnabled = false;
      },
      addHumanSlot() {
        this.$socket.emit('addHumanSlot');
      },
      addBotSlot() {
        this.$socket.emit('addBotSlot');
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
  .match-admin-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .match-admin {
      background-color: white;

      padding: 16px;
    }

    .chat-header {
      margin-top: 16px;
    }

    .player-list {
      margin: 16px 0;
    }

    .chat-box {
      height: 200px;
      border: 1px solid black;
      overflow-y: scroll;
      margin-bottom: 10px;
    }
  }

  .center-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

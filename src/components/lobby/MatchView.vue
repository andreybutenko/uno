<template>
  <div class="match-admin-container">
    <div class="match-admin">
      <h1>{{ currentMatch.name }}</h1>

      <template v-if="nameEditEnabled == false">
        <div class="center-button">
          <button @click="editName()" class="vbtn" v-if="isMatchAdmin">Edit Match Name</button>
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
            {{ !player.open ? player.player.name : 'Open' }} - {{ player.human ? 'Human' : 'Bot' }}{{ player.admin ? ' - Admin'  : '' }}
            <button @click="kickPlayer(player.index || i)" v-if="isMatchAdmin && (!player.human || !player.player || player.player.id != playerId)">Kick</button>
          </div>
        </div>

        <div class="center-button">
          <button @click="addBotSlot()" class="vbtn" v-if="isMatchAdmin">Add Bot</button>
          <button @click="addHumanSlot()" class="vbtn" v-if="isMatchAdmin && online">Add Human</button>
        </div>
      </div>

      <ChatView v-if="online" />
    </div>
  </div>
</template>

<script>
  import ChatView from '../ChatView';

  export default {
    name: 'MatchView',
    props: ['playerId', 'currentMatch', 'startGame', 'leaveMatch', 'updateMatchNameOffline', 'addPlayerOffline', 'kickPlayer'],
    components: { ChatView },
    data() {
      return {
        nameEdit: '',
        nameEditEnabled: false
      };
    },
    methods: {
      editName() {
        this.nameEdit = this.currentMatch.name;
        this.nameEditEnabled = true;
      },
      applyEdit() {
        if(this.$network.online) {
          this.$network.emit('updateMatchName', this.nameEdit);
        }
        else {
          this.updateMatchNameOffline(this.nameEdit);
        }
        this.nameEditEnabled = false;
      },
      addHumanSlot() {
        this.$network.emit('addHumanSlot');
      },
      addBotSlot() {
        if(this.$network.online) {
          this.$network.emit('addBotSlot');
        }
        else {
          this.addPlayerOffline();
        }
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
        return this.$network.offline ||
          (this.currentMatch != null &&
          this.currentMatch.players.filter(player => player.player &&
          player.player.id == this.playerId)[0].admin);
      },
      online() {
        return this.$network.online;
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

    .player-list {
      margin: 16px 0;
    }
  }

  .center-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

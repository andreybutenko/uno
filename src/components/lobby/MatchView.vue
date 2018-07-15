<template>
  <div class="match-admin-container">
    <div class="match-admin">
      <div class="primary-panel">
        <div class="title-container">
          <h1 v-if="!nameEditEnabled">{{ currentMatch.name }}</h1>
          <input class="name-edit" v-model="nameEdit" placeholder="Match Name" v-else />

          <button @click="editName()" class="lbtn"
            v-if="!nameEditEnabled && isMatchAdmin">
            Edit Match Name
          </button>
          <button @click="applyEdit()" class="lbtn"
            v-if="nameEditEnabled">
            Save Name
          </button>
        </div>

        <div class="vbtn-group">
          <button @click="startGame()" class="vbtn vbtn-green vbtn-stacked-icon">
            <font-awesome-icon icon="rocket" size="2x" />
            <span>Start Game</span>
          </button>
          <button class="vbtn vbtn-blue vbtn-stacked-icon" @click="shareVisible = !shareVisible" v-if="false">
            <font-awesome-icon icon="share-square" size="2x" />
            <span>Invite Friends</span>
          </button>
          <button @click="leaveMatch()" class="vbtn vbtn-stacked-icon">
            <font-awesome-icon icon="times" size="2x" />
            <span>Leave Game</span>
          </button>
        </div>

        <div class="share" v-if="shareVisible">
          <span>Invite friends to this match: </span>
          <input v-model="shareUrl" ref="shareInput" @click="selectShareInput()" readonly>
        </div>
      
        <div class="player-list" :class="{ admin: isMatchAdmin }">
          <div v-for="(player, i) in sortedPlayers" class="player-row" :key="i">
            <font-awesome-icon icon="crown" class="admin-icon" fixed-width v-if="player.admin" />
            <font-awesome-icon icon="grin-beam" class="human-icon" fixed-width v-if="player.human && !player.admin && !player.open && player.player.id != playerId" />
            <font-awesome-icon icon="grin-beam" class="player-icon" fixed-width v-if="player.human && !player.admin && !player.open && player.player.id == playerId" />
            <font-awesome-icon icon="robot" class="robot-icon" fixed-width v-if="!player.human" />
            <font-awesome-icon icon="spinner" class="spinner-icon" fixed-width spin v-if="player.open" />

            <span class="name" v-if="!player.open && (player.player.id != playerId || !usernameEditEnabled)">{{ player.player.name }}</span>
            <input class="name-edit" v-model="usernameEdit" placeholder="User Name" v-if="!player.open && player.player.id == playerId && usernameEditEnabled" />
            <span class="name" v-if="player.open"><i>Waiting for human to join...</i></span>

            <button
              class="vbtn"
              @click="kickPlayer(player.index || i)"
              v-if="isMatchAdmin && (!player.human || !player.player || player.player.id != playerId)">
                {{ player.human && !player.open ? 'Kick' : 'Remove' }}
            </button>

            <button
              class="vbtn"
              @click="editUsername()"
              v-if="online && !player.open && player.player.id == playerId && !usernameEditEnabled">
                Change Name
            </button>

            <button
              class="vbtn vbtn-blue"
              @click="applyUsernameEdit()"
              v-if="!player.open && player.player.id == playerId && usernameEditEnabled">
                Save
            </button>
          </div>
          <div class="player-row notice-row" v-if="currentMatch.players.length == 1">
            <span class="notice">Add some human or bot players to get started!</span>
          </div>
        </div>

        <div class="center-button player-button-group">
          <button @click="addBotSlot()" class="vbtn vbtn-stacked-icon" v-if="isMatchAdmin">
            <font-awesome-icon icon="robot" size="2x" />
            <span>Add Bot</span>
          </button>
          <button @click="addHumanSlot()" class="vbtn vbtn-stacked-icon" v-if="isMatchAdmin && online">
            <font-awesome-icon icon="grin-beam" size="2x" />
            <span>Add Human Slot</span>
          </button>
        </div>
      </div>

      <div class="secondary-panel">
        <ChatView v-if="online" />
      </div>
    </div>
  </div>
</template>

<script>
  import ChatView from '../ChatView';

  export default {
    name: 'MatchView',
    props: ['playerId', 'playerName', 'currentMatch', 'startGame', 'leaveMatch', 'updateMatchNameOffline', 'addPlayerOffline', 'kickPlayer'],
    components: { ChatView },
    data() {
      return {
        nameEdit: '',
        nameEditEnabled: false,
        usernameEdit: '',
        usernameEditEnabled: false,
        shareVisible: true
      };
    },
    methods: {
      editName() {
        this.nameEdit = this.currentMatch.name;
        this.nameEditEnabled = true;
      },
      applyEdit() {
        if(this.$network.online && this.nameEdit != this.currentMatch.name) {
          this.$network.emit('updateMatchName', this.nameEdit);
        }
        else {
          this.updateMatchNameOffline(this.nameEdit);
        }
        this.nameEditEnabled = false;
      },
      editUsername() {
        this.usernameEdit = this.playerName;
        this.usernameEditEnabled = true;
      },
      applyUsernameEdit() {
        this.$network.emit('setPlayerName', this.usernameEdit);
        this.usernameEditEnabled = false;
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
      },
      selectShareInput() {
        this.$refs.shareInput.select();
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
      },
      shareUrl() {
        return this.$network.baseUrl + '/#/join/' + this.currentMatch.id;
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
      padding: 16px 32px 32px 32px;
      display: flex;
      width: 80%;
      height: 80%;
      border-radius: 8px;

      .primary-panel {
        flex: 2;
        margin-right: 16px;
        display: flex;
        flex-direction: column;
      }

      .secondary-panel {
        flex: 1;
      }
    }

    .title-container {
      display: flex;
      padding: 16px 0;
      
      h1, input {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      input {
        padding: 16px;
        font-family: 'Josefin Sans', sans-serif;
      }

      button {
        margin-left: 8px;
      }
    }

    .share {
      border: 1px solid #bdc3c7;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      display: flex;
      align-items: center;

      input {
        flex: 1;
        margin-left: 1em;
        font-family: 'Josefin Sans', sans-serif;
        padding: 8px 16px;
      }
    }

    .player-list {
      margin-top: 16px;
      border: 1px solid #bdc3c7;
      border-radius: 8px;
      flex: 1;
      overflow-y: scroll;

      &.admin {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      .player-row {
        display: flex;
        align-items: center;
        padding: 16px;
        border-top: 1px solid #bdc3c7;
        font-size: 24px;
        min-height: 64px;

        &:first-of-type {
          border-top: 0;
          border-radius: 8px;
        }

        &.notice-row {
          .notice {
            margin: 16px;
            text-align: center;
            display: block;
            width: 100%;
            font-style: italic;
            color: #666;
          }
        }

        svg {
          align-self: flex-start;
        }

        .admin-icon {
          color: #8e44ad;
        }

        .robot-icon {
          color: black;
        }

        .human-icon {
          opacity: 0;
        }

        .player-icon {
          color: #e74c3c;
        }

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .name, input {
          flex: 1;
          padding: 0 16px;
        }

        input {
          flex: 1;
          margin: 0 1em;
          font-family: 'Josefin Sans', sans-serif;
          padding: 8px 16px;
        }
      }
    }

    .player-button-group {
      button {
        border-top: 0;
        border-radius: 0;
        margin-right: 0;
        border-right-width: 0;

        &:first-child {
          border-bottom-left-radius: 8px
        }

        &:last-child {
          border-bottom-right-radius: 8px;
          border-right-width: 1px;
        }
      }
    }
  }

  .center-button {
    display: flex;
    justify-content: center;
    align-items: center;

    & > * {
      flex: 1;
    }

    & > *:not(:last-child) {
      margin-right: 16px;
    }
  }
</style>

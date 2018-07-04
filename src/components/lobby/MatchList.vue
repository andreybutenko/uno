<template>
  <div class="match-find lobby-ui">
    <h1>Games</h1>

    <div class="match-list">
      <div class="item-match create-match" @click="createMatch()" :class="{ explicit: true }">
        <font-awesome-icon icon="plus-circle" size="2x" />

        <span class="label">Create a new match</span>
      </div>
      <div v-for="match in sortedMatches" :key="match.name" class="item-match">
        <span class="name">{{ match.name }}</span>
        <span class="status">{{ getStatus(match) }}</span>
        <span class="spacer"></span>
        <button @click="joinMatch(match)">Join</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchList',
  props: ['joinMatch', 'createMatch', 'currentMatch'],
  mounted() {
    this.$socket.emit('refreshMatches');
  },
  data() {
    return {
      matches: []
    };
  },
  methods: {
    getOpenSpots(match) {
      return match.players.filter(player => player.open).length;
    },
    getStatus(match) {
      const numOpen = this.getOpenSpots(match);
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
    }
  },
  sockets: {
    refreshMatches(matches) {
      this.matches = matches;
    }
  },
  computed: {
    sortedMatches() {
      const res = [];
      const currentMatchName = (this.currentMatch || {}).name;
      res.push(...this.matches.filter(match => match.name == currentMatchName));
      res.push(...this.matches.filter(match => this.getOpenSpots(match) > 0 && match.name != currentMatchName));
      res.push(...this.matches.filter(match => this.getOpenSpots(match) == 0 && match.name != currentMatchName));
      return res;
    },
  }
}
</script>

<style lang="scss" scoped>
  .match-find {
    background-color: #F22613;
    padding: 16px 0;

    .match-list {
      margin: 16px;
      border-radius: 8px;
      background-color: white;

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

        &.create-match {
          font-size: 20px;
          padding: 24px;
          justify-content: center;
          align-items: center;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          cursor: pointer;
          transition: all 250ms;

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

          &.explicit {
            flex-direction: column;

            .label {
              max-width: inherit;
              padding-left: 0;
              padding-top: 16px;
            }
          }
        }
      }
    }
  }
</style>

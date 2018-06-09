<template>
  <div class="game full-screen" :class="[currentColor]">
    <div class="opponent-detail-layer full-screen">
      <div class="opponent" v-for="(player, i) in opponents" :key="player" :style="getOpponentDetailStyle(i, opponents.length)">
        <div class="content" :class="{ active: player == currentPlayer }">{{ player }}</div>
      </div>
    </div>

    <div class="opponent-hand-layer full-screen">
      <div class="hand-container" :style="getOpponentHandStyle(i, opponents.length)" v-for="(player, i) in opponents">
        <CardBackHand :count="getHand(player).length" :selected="getOpponentSelected(player)" />
      </div>
    </div>

    <div class="stack">
      <Card
        v-for="(card, i) in field"
        :key="'field-' + i"
        :selectable="false"
        :color="card.color"
        :type="card.type"
        :style="{ zIndex: 3 - i }"
        v-if="i < 3" />
    </div>

    <div class="color-selector-container full-screen" v-if="needColor">
      <div class="color-selector">
        <p>Select a color!</p>
        <div class="colors-container">
          <div class="color red" @click="selectColor('red')">Red</div>
          <div class="color yellow" @click="selectColor('yellow')">Yellow</div>
          <div class="color green" @click="selectColor('green')">Green</div>
          <div class="color blue" @click="selectColor('blue')">Blue</div>
        </div>
      </div>
    </div>

    <div class="player-controls">
      <div class="player-hand">
        <Card
          v-for="(card, i) in playerHand"
          :key="'hand' + i"
          @click.native="playCard('Player 1', card, i)"
          :color="card.color"
          :type="card.type" />
      </div>
      <div class="player-btns">
        <div class="draw" @click="draw(playerName)">Draw</div>
      </div>
    </div>
  </div>
</template>

<script>
  import AiPlayer from '@/lib/AiPlayer';
  import DeckBuilder from '@/lib/DeckBuilder';
  import Rules from '@/lib/Rules';

  import Card from '@/components/Card';
  import CardBackHand from '@/components/CardBackHand';

  import Vue from 'vue'

  export default {
    name: 'Game',
    components: { Card, CardBackHand },
    mounted() {
      const deck = DeckBuilder.createDeck();
      DeckBuilder.shuffleDeck(deck);
      this.deck = deck;
      this.field.push(this.deck[0]);
      this.deck.splice(0, 1);
      this.createPlayers(3);
      this.currentPlayer = this.playerName;
    },
    data () {
      return {
        playerName: 'Player 1',
        currentPlayer: '',
        deck: [],
        field: [],
        players: {},
        boardDirection: +1,
        needColor: false,
        manualColor: null
      }
    },
    methods: {
      playCard(player, card) {
        if(Rules.isLegal(this.topCard, this.manualColor, card)) {
          this.field.unshift(card);

          let spliceIndex = this.getHand(player).indexOf(card);
          this.getHand(player).splice(spliceIndex, 1);

          if(this.onPlay(card) === true) return;

          this.nextTurn();
        }
      },

      onPlay(card) {
        if(card.type == 'skip') {
          this.nextTurn();
        }
        if(card.type == 'reverse') {
          this.boardDirection *= -1;
        }
        if(card.type == '+2') {
          this.draw(this.nextPlayer, 2);
        }
        if(card.type == 'wild+4') {
          this.draw(this.nextPlayer, 4);
        }
        if(card.type == 'wild' || card.type == 'wild+4') {
          if(this.getPlayer(this.currentPlayer).bot === true) {
            const colors = ['red', 'yellow', 'green', 'blue'];
            this.manualColor = colors[Math.floor(Math.random() * colors.length)];
          }
          else {
            this.manualColor = null;
            this.needColor = true;
            return true;
          }
        }
      },

      nextTurn() {
        this.currentPlayer = this.nextPlayer;
      },

      createPlayers(n) {
        for(let i = 1; i <= n; i++) {
          let name = 'Player ' + i;
          Vue.set(this.players, name, {
            hand: DeckBuilder.createHand(this.deck),
            bot: name != this.playerName,
            selectedCardIndex: -1
          });
        }
      },

      draw(player, n = 1) {
        const drawIndex = Math.floor(Math.random() * this.deck.length);
        for(let i = 0; i < n; i++) {
          this.getHand(player).push(this.deck[drawIndex]);
        }
        this.deck.splice(drawIndex, 1);
      },

      getHand(player) {
        if(this.playerList.indexOf(player) == -1) return [];
        return this.players[player].hand;
      },

      getOpponentSelected(player) {
        if(player != this.currentPlayer) return -1;
        return this.getPlayer(player).selectedCardIndex;
      },

      getPlayer(player) {
        return this.players[player];
      },

      getOpponentDetailStyle(i, total) {
        const frac = total != 2 ?
          i / (total - 1) : // subtract 1 because arrays are 0-indexed while math is 1-indexed
          (i + 1) / 3;
        const radians = frac * Math.PI;
        return {
          // marginLeft: 'calc(-50vw * ' + Math.cos(radians) + ')',
          // marginTop: 'calc(-50vh * ' + Math.sin(radians) + ')',
          left: 'calc(50vw * ' + -1 * Math.cos(radians) + ' + 50vw)',
          top: 'calc(50vh * ' + -1 * Math.sin(radians) + ' + 50vh)',
          transform: 'translateX(-' + (frac * 200) + 'px)'
        }
      },

      getOpponentHandStyle(i, total) {
        const frac = total != 2 ?
          i / (total - 1) : // subtract 1 because arrays are 0-indexed while math is 1-indexed
          (i + 1) / 3;
        const radians = frac * Math.PI;
        return {
          left: 'calc(50vw * ' + -1 * Math.cos(radians) + ' + 50vw + ' + (-400 * (frac - 0.5))  + 'px)',
          top: 'calc(50vh * ' + -1 * Math.sin(radians) + ' + 50vh + 200px)',
          transform: 'rotate(' + (0.5 * Math.PI + radians) + 'rad) scale(0.25) translateX(-' + ((1 - frac) * 100) + '%)'//
        }
      },

      selectColor(color) {
        this.needColor = false;
        this.manualColor = color;
        this.nextTurn();
      }
    },
    computed: {
      currentColor() {
        if(this.topCard == null) return '';
        if(this.topCard.color != 'special') {
          return this.topCard.color;
        }
        return this.manualColor || 'special';
      },
      fieldReversed() {
        return this.field.slice().reverse()
      },
      topCard() {
        return this.field[0];
      },
      playerHand() {
        return this.getHand(this.playerName);
      },
      playerList() {
        return Object.keys(this.players);
      },
      opponents() {
        return Object.keys(this.players).filter(name => name != this.playerName);
      },
      nextPlayer() {
        let nextIndex = this.playerList.indexOf(this.currentPlayer) + this.boardDirection;
        if(nextIndex >= this.playerList.length) nextIndex = 0;
        else if(nextIndex < 0)  nextIndex = this.playerList.length - 1;
        return this.playerList[nextIndex];
      }
    },
    watch: {
      currentPlayer(currentPlayer) {
        const player = this.getPlayer(currentPlayer);
        player.selectedCardIndex = -1;

        if(player.bot === true) {
          const setSelectedCard = index => {
            player.selectedCardIndex = index;
          }
          const drawCard = () => {
            this.draw(this.currentPlayer);
          }
          const chooseCard = card => {
            this.playCard(this.currentPlayer, card);
          }
          AiPlayer.makeMove(player.hand, this.manualColor, this.topCard, setSelectedCard, drawCard, chooseCard);
          // setTimeout(() => {
          //   let res = false;
          //   while(res === false) {
          //     res = AiPlayer.makeMove(player.hand, this.manualColor, this.topCard);
          //     if(res === false) {
          //       this.draw(this.currentPlayer);
          //     }
          //   }
          //
          //   player.selectedCardIndex = player.hand.indexOf(res);
          //
          //   setTimeout(() => {
          //     this.playCard(this.currentPlayer, res);
          //   }, 1000);
          // }, 1000);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .game {
    transition: background-color 750ms;

    &.red {
      background-color: #ff5555;
    }

    &.yellow {
      background-color: #ffaa00;
    }

    &.green {
      background-color: #55aa55;
    }

    &.blue {
      background-color: #5555ff;
    }

    &.special {
      background-color: #b2bec3;
    }
  }

  .full-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .opponent-detail-layer {
   .opponent {
      position: absolute;

      .content {
        display: block;
        border: 3px solid black;
        width: 200px;
        height: 200px;
        transition: background-color 250ms;

        &.active {
          background-color: #81ecec;
        }
      }
    }
  }

  .opponent-hand-layer {
    .hand-container {
      position: absolute;
      transform-origin: left top;
    }
  }

  .color-selector-container {
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .color-selector {
      background-color: #ffffff;
      padding: 16px;
      width: 432px;

      p {
        padding: 16px 0 32px 0;
        text-align: center;
      }

      .colors-container {
        display: flex;

        .color {
          flex: 1 0 100px;
          text-align: center;
          padding: 32px 8px;
          cursor: pointer;

          &.red {
            background-color: #ff5555;
          }

          &.yellow {
            background-color: #ffaa00;
          }

          &.green {
            background-color: #55aa55;
          }

          &.blue {
            background-color: #5555ff;
          }
        }
      }
    }
  }

  .sep {
    background-color: black;
    height: 10px;
    width: 100%;
    margin: 16px;
  }

  .stack {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    & /deep/ .card {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
    }

    & /deep/ :nth-child(2) {
      transform: translate(-50%, -50%) rotate(15deg);
    }

    & /deep/ :nth-child(3) {
      transform: translate(-50%, -50%) rotate(30deg);
    }
  }

  .player-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .player-hand {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    .player-btns {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      & > div {
        padding: 8px;
        margin: 8px;
        cursor: pointer;
      }

      .draw {
        background-color: #ff7675;
      }
    }
  }

  .players {
    div.active {
      color: green;
      font-weight: bold;
    }
  }
</style>

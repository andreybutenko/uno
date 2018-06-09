<template>
  <div class="game full-screen" :class="[currentColor]">
    <OpponentDetailLayer :opponents="opponents" :currentPlayer="currentPlayer" :players="players" />

    <OpponentHandLayer :opponents="opponents" :players="players" />

    <CardStack :stack="field" />

    <ColorSelectorModal :show="needColor" :selectColor="selectColor" />

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
  import CardStack from '@/components/CardStack';
  import ColorSelectorModal from '@/components/ColorSelectorModal';
  import OpponentDetailLayer from '@/components/OpponentDetailLayer';
  import OpponentHandLayer from '@/components/OpponentHandLayer';

  import Vue from 'vue'

  export default {
    name: 'Game',
    components: { Card, CardStack, ColorSelectorModal, OpponentDetailLayer, OpponentHandLayer },
    mounted() {
      const deck = DeckBuilder.createDeck();
      DeckBuilder.shuffleDeck(deck);
      this.deck = deck;

      const top = DeckBuilder.getTop(deck);
      this.field.push(top.card);
      this.deck.splice(top.index, 1);

      this.createPlayers(5);
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

      getPlayer(player) {
        return this.players[player];
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
        }
      },
      field(field) {
        if(field.length > 7) {
          this.deck.push(field[7]);
          field.splice(7, 1);
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

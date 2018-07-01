<template>
  <div class="game full-screen" :class="[currentColor]" v-if="uno != null">
    <OpponentDetailLayer :opponents="opponents" :currentPlayer="uno.currentPlayer" :players="uno.players" />

    <OpponentHandLayer :opponents="opponents" :getPlayer="uno.getPlayer" :players="uno.players" />

    <CardStack :stack="uno.stack" />

    <ColorSelectorModal :show="needColor" :selectColor="selectColor" />

    <div class="player-controls">
      <div class="player-hand">
        <Card
          v-for="(card, i) in playerHand"
          :key="'hand' + i"
          @click.native="uno.playCard(playerId, card, i)"
          :color="card.color"
          :type="card.type" />
      </div>
      <div class="player-btns">
        <div class="draw" @click="uno.draw(playerId)">Draw</div>
      </div>
    </div>
  </div>
</template>

<script>
  import AiPlayer from '@/../common/AiPlayer';
  import Store from '@/Store';
  import Uno from '@/../common/Uno';

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
      this.uno = new Uno(Store.get('players'), this.emit);
      this.playerId = Store.get('playerId');
    },
    data () {
      return {
        playerId: 'Andrey',
        uno: null,
        needColor: false
      }
    },
    methods: {
      emit(event) {
        if(event == 'needColor') {
          this.needColor = true;
        }
      },
      selectColor(color) {
        this.needColor = false;
        this.uno.setManualColor(color);
      }
    },
    computed: {
      currentColor() {
        if(this.uno.topStack == null) return '';
        if(this.uno.topStack.color != 'special') {
          return this.uno.topStack.color;
        }
        return this.uno.manualColor || 'special';
      },
      playerHand() {
        return this.uno.getPlayer(this.playerId).hand;
      },
      currentPlayer() {
        if(this.uno === null) return '';
        return this.uno.currentPlayer;
      },
      opponents() {
        if(this.uno === null) return [];
        return this.uno.getPlayers().filter(player => player.id != this.playerId);
      }
    },
    watch: {
      currentPlayer(currentPlayer) {
        const player = this.uno.getPlayer(currentPlayer);
        player.selectedCardIndex = -1;

        if(player.human === false && player.remote === false) {
          const setSelectedCard = index => {
            player.selectedCardIndex = index;
          }
          const drawCard = () => {
            this.uno.draw(this.currentPlayer);
          }
          const chooseCard = card => {
            setSelectedCard(-1);
            this.uno.playCard(this.currentPlayer, card);
          }

          AiPlayer.makeMove(player.hand, this.uno.manualColor, this.uno.topStack, setSelectedCard, drawCard, chooseCard);
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
</style>

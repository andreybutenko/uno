<template>
  <div class="game full-screen" :class="[currentColor]" v-if="uno != null">
    <OpponentDetailLayer :opponents="opponents" :currentPlayer="uno.currentPlayer" :players="uno.players" />

    <OpponentHandLayer :opponents="opponents" :getPlayer="uno.getPlayer" :players="uno.players" />

    <CardStack :stack="uno.stack" />

    <ColorSelectorModal :show="needColor" :selectColor="selectColor" />

    <div class="player-controls">
      <transition-group name="list" tag="div" class="player-hand" ref="playerHand" :class="{ inactive: !playerTurn }" :style="{ marginLeft: shrinkAmountPadding }">
        <Card
          v-for="(card, i) in playerHand"
          :key="'hand' + i"
          @click.native="selectCard(card, i)"
          @mouseover.native="mouseover(i)"
          :color="card.color"
          :type="card.type"
          :animateIn="true"
          :animateDisabled="i != removeIndex && removing"
          :animateRemoving="i == removeIndex"
          :hoverFocus="true"
          :shrinkAmount="shrinkAmountPx"
          padding="32px" />
      </transition-group>
      <div class="player-btns">
        <div class="draw" @click="draw">Draw</div>
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
      this.$socket.emit('resyncGame');

      this.$nextTick(() => {
        this.windowWidth = window.innerWidth;
        window.addEventListener('resize', () => {
          this.windowWidth = window.innerWidth;
        });
      });
    },
    beforeDestroy() {
      this.$socket.emit('leaveMatch');
    },
    data () {
      return {
        playerId: 'Andrey',
        uno: null,
        localGame: false,
        needColor: false,
        removeIndex: -1,
        removing: false,
        windowWidth: 1920,
        shrinkAmount: 0
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
        if(this.localGame) {
          this.uno.setManualColor(color);
        }
        else {
          this.$socket.emit('userSelectColor', color);
        }
      },
      draw() {
        if(this.localGame) {
          this.uno.draw(playerId);
        }
        else {
          this.$socket.emit('draw');
        }
      },
      selectCard(card, i) {
        if(this.removeIndex == -1) {
          this.removeIndex = i;
          this.removing = true;
          setTimeout(() => {
            this.playCard(card, i);
            setTimeout(() => this.removing = false, 250);
          }, 250);
        }
      },
      playCard(card, i) {
        if(this.localGame) {
          this.uno.playCard(this.playerId, card);
        }
        else {
          this.$socket.emit('playCard', card);
        }
      },
      mouseover(i) {
      },
      computeShrinkAmount() {
        if(this.compressed) {
          const numCards = this.playerHand.length;
          const handRealWidth = (120 + 32) * (numCards + 1);
          this.shrinkAmount = (handRealWidth - this.windowWidth) / numCards;
        }
        else {
          this.shrinkAmount = 0;
        }
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
        if(this.uno === null) return [];
        return this.uno.getPlayer(this.playerId).hand;
      },
      currentPlayer() {
        if(this.uno === null) return '';
        return this.uno.currentPlayer;
      },
      playerTurn() {
        return this.currentPlayer == this.playerId;
      },
      opponents() {
        if(this.uno === null) return [];
        return this.uno.getPlayers().filter(player => player.id != this.playerId);
      },
      compressed() {
        return 180 * this.playerHand.length > this.windowWidth;
      },
      shrinkAmountPadding() {
        return this.shrinkAmount * 1.2 + 'px';
      },
      shrinkAmountPx()  {
        return '-' + this.shrinkAmount + 'px';
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
      },
      playerHand()  {
        this.removeIndex = -1;
        this.computeShrinkAmount();
      },
      windowWidth() {
        this.computeShrinkAmount();
      }
    },
    sockets: {
      onError(text) {
        alert(text);
      },
      onGameEmit(event) {
        this.emit(event);
      },
      setPlayerHand({ id, hand }) {
        this.uno.remoteSetPlayerHand(id, hand);
      },
      setPlayerHandLength({ id, length }) {
        this.uno.remoteSetPlayerHandLength(id, length);
      },
      setPlayerSelectCardIndex({ id, index }) {
        this.uno.remoteSetPlayerSelectedCardIndex(id, index);
      },
      setCurrentPlayer(id) {
        this.uno.remoteSetCurrentPlayer(id);
      },
      setBoardDirection(direction) {
        this.uno.remoteSetBoardDirection(direction);
      },
      setManualColor(color) {
        this.uno.remoteSetManualColor(color);
      },
      setStack(stack) {
        this.uno.remoteSetStack(stack);
      },
      unoStateUpdate(unoState) {
        this.uno.remoteSetState(unoState);
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

  .player-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .player-hand {
      display: flex;
      flex-direction: row;
      justify-content: center;
      transition: all 250ms;

      &.inactive {
        filter: grayscale(50%);
        transform: scale(0.8);
        transform-origin: bottom;
      }
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

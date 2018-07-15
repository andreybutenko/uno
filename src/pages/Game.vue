<template>
  <div class="game-container full-screen" :class="[currentColor]" v-if="uno != null">
    <ChatView :dark="true" :onClose="() => showChat = false" v-if="showChat" />

    <div class="game" ref="game">
      <SpinBackground :direction="direction" />

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
  </div>
</template>

<script>
  import AiPlayer from '@/../common/AiPlayer';
  import Store from '@/Store';
  import Rules from '@/../common/Rules';
  import Uno from '@/../common/Uno';

  import Card from '@/components/Card';
  import CardStack from '@/components/CardStack';
  import ChatView from '@/components/ChatView';
  import ColorSelectorModal from '@/components/ColorSelectorModal';
  import OpponentDetailLayer from '@/components/OpponentDetailLayer';
  import OpponentHandLayer from '@/components/OpponentHandLayer';
  import SpinBackground from '@/components/SpinBackground';

  import Vue from 'vue'

  export default {
    name: 'Game',
    components: { Card, CardStack, ChatView, ColorSelectorModal, OpponentDetailLayer, OpponentHandLayer, SpinBackground },
    mounted() {
      this.uno = new Uno(Store.get('players'), this.emit);
      this.playerId = Store.get('playerId');

      if(this.$network.online) {
        this.$network.emit('resyncGame');
      }

      this.$nextTick(() => {
        this.windowWidth = this.$refs.game.clientWidth;
        window.addEventListener('resize', () => {
          this.windowWidth = this.$refs.game.clientWidth;
        });
      });
    },
    beforeDestroy() {
      if(this.$network.online) {
        this.$network.emit('leaveMatch');
      }
    },
    data () {
      return {
        playerId: 'Andrey',
        uno: null,
        localGame: this.$network.offline,
        needColor: false,
        removeIndex: -1,
        removing: false,
        windowWidth: 1920,
        shrinkAmount: 0,
        showChat: this.$network.online
      }
    },
    methods: {
      emit(event) {
        if(this.localGame) {
          const player = this.uno.getPlayer(this.uno.currentPlayer);
          if(event == 'needColor' && player.human === false && player.remote === false) {
            this.uno.setManualColor(AiPlayer.selectColor(player.hand));
          }
          else if(event == 'needColor') {
            this.needColor = true;
          }
          else if(event == 'win') {
            alert('winner: ' + data);
          }
        }
        else if(event == 'needColor') {
          this.needColor = true;
        }
      },
      selectColor(color) {
        this.needColor = false;
        if(this.localGame) {
          this.uno.setManualColor(color);
        }
        else {
          this.$network.emit('userSelectColor', color);
        }
      },
      draw() {
        if(this.localGame) {
          this.uno.draw(this.playerId);
        }
        else {
          this.$network.emit('draw');
        }
      },
      selectCard(card, i) {
        if(this.localGame && !Rules.isLegal(this.uno.topStack, this.uno.manualColor, card)) {
          alert('That is not a valid move.');
          return;
        }
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
          this.$network.emit('playCard', card);
        }
      },
      mouseover(i) {
        if(!this.localGame && this.playerTurn) {
          this.$network.emit('userHighlightCard', i);
        }
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
      direction() {
        return this.uno.boardDirection;
      },
      opponents() {
        if(this.uno === null) return [];

        // Order players so that player is at index 0
        // Otherwise, positions on the board are out-of-order.
        const players = this.uno.getPlayers().slice();
        while(players[0].id != this.playerId) {
          players.push(players.shift()); // rotate one step
        }

        return players.filter(player => player.id != this.playerId);
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
      },
      showChat() {
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    },
    sockets: {
      onError(text) {
        alert(text);
      },
      onWin(data) {
        alert('winner: ' + data);
        console.log(data);
        console.log(this.uno);
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
  .game-container {
    display: flex;
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

  .game {
    flex: 1;
    position: relative;
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

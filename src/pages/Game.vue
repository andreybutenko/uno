<template>
  <div class="game">
    <div class="players">
      <div v-for="player in playerList" :class="{ active: player == currentPlayer }"><span v-if="player == playerName">***</span> {{ player }} - {{ getHand(player).length }}</div>
    </div>
    <div class="sep"></div>
    <div class="stack">
      <Card
        v-for="(card, i) in field"
        :key="'field-' + i"
        :selectable="false"
        :color="card.color"
        :type="card.type" />
      </div>
    <div class="sep"></div>
    <div class="hand">
      <Card
        v-for="(card, i) in playerHand"
        :key="'hand' + i"
        @click.native="playCard('Player 1', card, i)"
        :color="card.color"
        :type="card.type" />
      <div @click="draw(playerName)">Draw</div>
    </div>
  </div>
</template>

<script>
  import AiPlayer from '@/lib/AiPlayer';
  import DeckBuilder from '@/lib/DeckBuilder';
  import Rules from '@/lib/Rules';
  import Card from '@/components/Card';
  import Vue from 'vue'

  export default {
    name: 'Game',
    components: { Card },
    mounted() {
      const deck = DeckBuilder.createDeck();
      DeckBuilder.shuffleDeck(deck);
      this.deck = deck;
      this.field.push(this.deck[0]);
      this.deck.splice(0, 1);
      this.createPlayers(6);
      this.currentPlayer = this.playerName;
      this.$forceUpdate(); // re-compute computed properties
    },
    data () {
      return {
        playerName: 'Player 1',
        currentPlayer: '',
        deck: [],
        field: [],
        players: {}
      }
    },
    methods: {
      playCard(player, card) {
        if(Rules.isLegal(this.topCard, card)) {
          this.field.unshift(card);

          let spliceIndex = this.getHand(player).indexOf(card);
          this.getHand(player).splice(spliceIndex, 1);

          this.nextPlayer();
        }
      },
      nextPlayer() {
        let newIndex = this.playerList.indexOf(this.currentPlayer) + 1;
        if(newIndex >= this.playerList.length) {
          newIndex = 0;
        }

        this.currentPlayer = this.playerList[newIndex];
      },
      createPlayers(n) {
        for(let i = 1; i <= n; i++) {
          let name = 'Player ' + i;
          Vue.set(this.players, name, {
            hand: DeckBuilder.createHand(this.deck),
            bot: name != this.playerName
          });
        }
      },
      draw(player) {
        const drawIndex = Math.floor(Math.random() * this.deck.length);
        this.getHand(player).push(this.deck[drawIndex]);
        this.deck.splice(drawIndex, 1);
      },
      getHand(player) {
        if(this.playerList.indexOf(player) == -1) return [];
        return this.players[player].hand;
      },
      getPlayer(player) {
        return this.players[player];
      }
    },
    computed: {
      topCard() {
        return this.field[0];
      },
      playerHand() {
        return this.getHand(this.playerName);
      },
      playerList() {
        return Object.keys(this.players);
      }
    },
    watch: {
      currentPlayer(currentPlayer) {
        if(this.getPlayer(currentPlayer).bot === true) {
          setTimeout(() => {
            let res = false;
            while(res === false) {
              res = AiPlayer.makeMove(this.getHand(this.currentPlayer), this.topCard);
              if(res === false) {
                this.draw(this.currentPlayer);
              }
            }
            this.playCard(this.currentPlayer, res);
          }, 500);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .game {
    //display: flex;
    //flex-wrap: wrap;
  }

  .sep {
    background-color: black;
    height: 10px;
    width: 100%;
    margin: 16px;
  }

  .stack {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .hand {
    display: flex;
    flex-direction: row;
  }

  .players {
    div.active {
      color: green;
      font-weight: bold;
    }
  }
</style>

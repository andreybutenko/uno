<template>
  <div class="game">
    <Card
      v-for="(card, i) in field"
      :key="'field-' + i"
      :selectable="false"
      :color="card.color"
      :type="card.type" />
    <div class="sep"></div>
    <Card
      v-for="(card, i) in deck"
      :key="'deck' + i"
      @click.native="playCard(card, i)"
      :color="card.color"
      :type="card.type" />
  </div>
</template>

<script>
  import DeckBuilder from '@/lib/DeckBuilder';
  import Rules from '@/lib/Rules';
  import Card from '@/components/Card';
  export default {
    name: 'Game',
    components: { Card },
    mounted() {
      const deck = DeckBuilder.createDeck();
      DeckBuilder.shuffleDeck(deck);
      this.deck = deck;
      this.field.push(this.deck[0]);
      this.deck.splice(0, 1)
    },
    data () {
      return {
        field: [],
        deck: []
      }
    },
    methods: {
      playCard(card, index) {
        console.log(this.topCard, card)
        if(Rules.isLegal(this.topCard, card)) {
          this.field.unshift(card);
          this.deck.splice(index, 1);
        }
      }
    },
    computed: {
      topCard() {
        return this.field[0];
      }
    }
  }
</script>

<style lang="scss" scoped>
  .game {
    display: flex;
    flex-wrap: wrap;
  }

  .sep {
    background-color: black;
    height: 10px;
    width: 100%;
  }
</style>

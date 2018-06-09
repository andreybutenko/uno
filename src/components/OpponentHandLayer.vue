<template>
  <div class="opponent-hand-layer full-screen">
    <div class="hand-container" :style="getOpponentHandStyle(i, opponents.length)" v-for="(player, i) in opponents">
      <CardBackHand :count="getHand(player).length" :selected="getOpponentSelected(player)" />
    </div>
  </div>
</template>

<script>
  import CardBackHand from '@/components/CardBackHand';
  import RadialLayout from '@/lib/RadialLayout';

  export default {
    name: 'OpponentHandLayer',
    components: { CardBackHand },
    props: ['opponents', 'players'],
    methods: {
      getHand(player) {
        return this.players[player].hand;
      },
      getOpponentSelected(player) {
        return this.players[player].selectedCardIndex;
      },
      getOpponentHandStyle: RadialLayout.getOpponentHandStyle
    }
  }
</script>

<style lang="scss" scoped>
  .opponent-hand-layer {
    .hand-container {
      position: absolute;
      transform-origin: left top;
    }
  }
</style>

<template>
  <div class="opponent-hand-layer full-screen">
    <div class="hand-container" :style="getOpponentHandStyle(i, opponents.length)" v-for="(player, i) in opponents" :key="player.id">
      <CardBackHand :count="getPlayer(player.id).hand.length" :selected="getPlayer(player.id).selectedCardIndex" />
    </div>
  </div>
</template>

<script>
  import CardBackHand from '@/components/CardBackHand';
  import RadialLayout from '@/lib/RadialLayout';

  export default {
    name: 'OpponentHandLayer',
    components: { CardBackHand },
    props: ['opponents', 'getPlayer', 'players'],
    methods: {
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

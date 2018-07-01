<template>
  <div class="opponent-detail-layer full-screen">
    <div class="opponent" v-for="(player, i) in opponents" :key="player.id" :style="getOpponentDetailStyle(i, opponents.length)">
      <div class="content" :class="{ active: player.id == currentPlayer }">{{ player.name }}</div>
    </div>
  </div>
</template>

<script>
  import CardBackHand from '@/components/CardBackHand';
  import RadialLayout from '@/lib/RadialLayout';

  export default {
    name: 'OpponentDetailLayer',
    components: { CardBackHand },
    props: ['opponents', 'currentPlayer', 'players'],
    methods: {
      getOpponentSelected(player) {
        return this.players[player].selectedCardIndex;
      },
      getOpponentDetailStyle: RadialLayout.getOpponentDetailStyle
    }
  }
</script>

<style lang="scss" scoped>
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
</style>

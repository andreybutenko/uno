<template>
  <div class="opponent-detail-layer full-screen">
    <div class="opponent" :class="{ active: player.id == currentPlayer }" v-for="(player, i) in opponents" :key="player.id" :style="log(getOpponentDetailStyle(i, opponents.length)) || getOpponentDetailStyle(i, opponents.length)">
      <div class="content" :style="{ backgroundColor: getColor(i) }">
        <span class="player-name">{{ player.name }}</span>
        <span class="hand-count">
          <span>{{ player.hand.length }}</span>
          <svg><use xlink:href="/static/+2.svg#+2"></use></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import CardBackHand from '@/components/CardBackHand';
  import RadialLayout from '@/lib/RadialLayout';

  const COLORS = [
    '#55efc4', '#a29bfe', '#81ecec', '#dfe6e9', '#ff7675',
    '#ffeaa7', '#74b9ff', '#fab1a0', '#fd79a8'
  ];

  export default {
    name: 'OpponentDetailLayer',
    components: { CardBackHand },
    props: ['opponents', 'currentPlayer', 'players'],
    methods: {
      getOpponentSelected(player) {
        return this.players[player].selectedCardIndex;
      },
      log(e) {  console.log(e)},
      getOpponentDetailStyle: RadialLayout.getOpponentDetailStyle,
      getColor(i) {
        return COLORS[i % COLORS.length];
      }
    }
  }
</script>

<style lang="scss" scoped>
  .opponent-detail-layer {
   .opponent {
      position: absolute;
      display: flex;
      width: 150px;
      min-height: 150px;
      padding: 8px;
      transition: all 250ms;
      filter: grayscale(80%);

      &.active {
        padding: 1px;
        filter: grayscale(0%);
      }

      .content {
        flex: 1;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 3px solid black;

        .player-name {
          text-align: center;
          margin-bottom: 8px;
        }

        .hand-count {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;

          svg {
            width: 1em;
            height: 1em;
            margin-left: 4px;
          }

          & /deep/ use { fill: #000000; }
        }
      }
    }
  }
</style>

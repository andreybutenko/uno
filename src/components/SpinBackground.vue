<template>
  <div class="spin-canvas" @click="flipDirection">
    <canvas ref="spinCanvas"></canvas>
  </div>
</template>

<script>
  const COLORS = [
    '#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#dfe6e9',
    '#ffeaa7', '#fab1a0', '#ff7675', '#fd79a8'
  ];

  export default {
    name: 'SpinBackground',
    data() {
      return {
        direction: 1,
        directionFactor: 1,
        shapes: []
      }
    },
    mounted() {
      for(let i = 0; i < 100; i++) {
        this.shapes.push({
          //amplitudePeriod: 1000 * (i + 1),
          timeOffset: Math.random() * 40000,
          xOffsetFactor: Math.random() * 0.5 + 1,
          yOffsetFactor: Math.random() * 0.5 + 1,
          xOffsetPeriodFactor: Math.random() * 0.5 - 1,
          yOffsetPeriodFactor: Math.random() * 0.5 - 1,
          periodFactor: Math.random() * 0.5 - 1,
          x: 200,
          y: 100,
          offsetRad: Math.random() *2 *  Math.PI,
          radiusPeriodFactor: Math.random() * 0.5 + 1,
          fill: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }

      this.$refs.spinCanvas.width = window.innerWidth;
      this.$refs.spinCanvas.height = window.innerHeight;

      window.requestAnimationFrame(this.updateShapes);
    },
    methods: {
      flipDirection() {
        console.log('flip')
        this.direction = this.direction * -1;
      },
      getValues() {
        return {
          amplitudeX: window.innerWidth / 3,
          amplitudeY: window.innerHeight / 3,
          centerX: window.innerWidth / 2,
          centerY: window.innerHeight / 2,
          offsetX: window.innerWidth / 10,
          offsetY: window.innerHeight / 10,
        };
      },
      updateShapes(timestamp) {
        if(this.$refs && this.$refs.spinCanvas && this.$refs.spinCanvas.getContext) {
          const ctx = this.$refs.spinCanvas.getContext('2d');
          ctx.clearRect(0, 0, this.$refs.spinCanvas.width, this.$refs.spinCanvas.height);

          //this.directionFactor = 3 / 4 * this.direction + 1 / 4 * this.directionFactor;
          this.directionFactor = 3 / 4 * this.direction + 1 / 4 * this.directionFactor;

          const SPIN_PERIOD = 50000;
          const RADIUS = 15;
          const RADIUS_PERIOD = 30000;
          const { amplitudeX, amplitudeY, centerX, centerY, offsetX, offsetY } = this.getValues();

          for(let shape of this.shapes) {
            let localTime = timestamp + shape.timeOffset;

            shape.x = amplitudeX *
              Math.sin(this.directionFactor * localTime * 2 * Math.PI / SPIN_PERIOD * shape.periodFactor + shape.offsetRad) +
              centerX + offsetX * shape.xOffsetFactor * Math.sin(localTime * 2 * Math.PI / SPIN_PERIOD * shape.xOffsetPeriodFactor);

            shape.y = amplitudeY *
              Math.cos(this.directionFactor * localTime * 2 * Math.PI / SPIN_PERIOD * shape.periodFactor + shape.offsetRad) +
              centerY + offsetY * shape.yOffsetFactor * Math.sin(localTime * 2 * Math.PI / SPIN_PERIOD * shape.yOffsetPeriodFactor);

            const radius = RADIUS * (Math.sin(localTime * 2 * Math.PI / RADIUS_PERIOD * shape.radiusPeriodFactor) * 0.5 + 1.5);

            ctx.fillStyle = shape.fill + '88';
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, radius, 0, 2 * Math.PI);
            ctx.fill();
          }
        }

        

        window.requestAnimationFrame(this.updateShapes);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .spin-canvas {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>

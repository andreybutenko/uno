<template>
  <div class="card-back" :class="[selectableClass, selectedClass]">
    <div class="card-inner">
      <span class="spacer"></span>
      <div class="swoosh"></div>
      <span class="swish-content">UNO</span>
      <span class="spacer"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardBack',
    props: ['selectable', 'selected'],
    computed: {
      // If the card is selectable/clickable
      selectableClass() {
        return this.selectable === false ? 'no-select' : 'selectable';
      },
      // If the card is actively selected
      selectedClass() {
        return this.selected ? 'selected' : '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-back,
  .card-back .card-inner {
    border-radius: 16px;
  }

  .card-back {
    width: 120px;
    height: 180px;
    padding: 8px;
    border: 1px solid black;
    cursor: default;
    user-select: none;
    transition: transform 250ms;
    background-color: #ffffff;

    &.selectable  {
      cursor: pointer;
    }

    &.selected {
      transform: translateY(-25%);
    }

    .card-inner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: #000000;

      .swoosh {
        flex-grow: 1;
        background-color: #ff5555;
        transform: rotate(45deg) scaleX(1.5) scaleY(1.5);
        clip-path: ellipse(25% 50% at 50% 50%);
      }

      .swish-content {
        color: #ffffff;
        position: absolute;
        width: 100%;
        text-align: center;
        font-weight: 900;
        font-size: 48px;
        top: 50%;
        transform: translateY(-50%);
      }

      .spacer {
        height: 40px;
      }
    }
  }
</style>

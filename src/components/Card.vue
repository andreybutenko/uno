<template>
  <div class="card" :class="[color, type, selectableClass, animateClass, hoverFocusClass]" :style="{ marginLeft: shrinkAmount, marginRight: padding }">
    <div class="card-inner">
      <span class="top-num" :class="{ hasSvg: typeDisplayHasSvg }" v-html="typeDisplay"></span>
      <div class="swoosh"></div>
      <span class="swish-num" :class="{ hasSvg: swooshHasSvg }" v-html="swooshDisplay"></span>
      <span class="bottom-num" :class="{ hasSvg: typeDisplayHasSvg }" v-html="typeDisplay"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: ['color', 'type', 'selectable', 'animateRemoving', 'animateDisabled', 'shrinkAmount', 'padding', 'hoverFocus'],
    data() {
      return {
        typeSpecials: ['skip', 'reverse', 'wild'],
        swooshSpecials: ['+2', 'skip', 'reverse', 'wild', 'wild+4'],
        animationInCompleted: !this.animateIn,
        animationOutCompleted: false
      }
    },
    computed: {
      typeDisplay() {
        if(this.type == 'wild+4') {
          return '+4';
        }
        if(this.typeDisplayHasSvg) {
          return '<svg><use xlink:href="/static/' + this.type + '.svg#' + this.type + '"></use></svg>';
        }
        return this.type;
      },
      typeDisplayHasSvg() {
        return this.typeSpecials.indexOf(this.type) != -1;
      },
      swooshDisplay() {
        if(this.swooshHasSvg) {
          return '<svg><use xlink:href="/static/' + this.type + '.svg#' + this.type + '"></use></svg>';
        }
        return this.type;
      },
      swooshHasSvg() {
        return this.swooshSpecials.indexOf(this.type) != -1;
      },
      selectableClass() {
        return this.selectable === false ? 'no-select' : 'selectable';
      },
      animateClass() {
        if(this.animateRemoving) {
          return 'out';
        }
        else if(this.animateDisabled) {
          return 'no-animate';
        }
        else {
          return '';
        }
      },
      hoverFocusClass() {
        return this.hoverFocus ? 'hover-focus' : '';
      }
    },
    watch: {
      animateRemoving() {
        setTimeout(() => this.animationOutCompleted = true, 10);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card,
  .card-inner {
    border-radius: 16px;
  }

  .card {
    width: 120px;
    height: 180px;
    padding: 8px;
    border: 1px solid black;
    cursor: default;
    user-select: none;
    background-color: #ffffff;
    transition: all 250ms;
    flex-shrink: 0;
    z-index: 1;

    &.hover-focus {
      &:hover {
        transform: scale(1.2);
        transform-origin: bottom;
      }
    }

    &.no-animate {
      transition: all 0ms;
    }
    
    // Handled by Vue:
    &.list-enter {
      opacity: 0;
      transform: translateY(30px);
    }

    // Handled by us, because weird behavior animating out:
    &.out {
      transform: translateY(-100%) scale(1.2) !important;
      margin-left: -120px;
      opacity: 0.5;
    }

    &.selectable  {
      cursor: pointer;
    }

    &.red {
      .card-inner { background-color: #ff5555; }
      & /deep/ use { fill: #ff5555; }
    }

    &.yellow {
      .card-inner { background-color: #ffaa00; }
      & /deep/ use { fill: #ffaa00; }
    }

    &.green {
      .card-inner { background-color: #55aa55; }
      & /deep/ use { fill: #55aa55; }
    }

    &.blue {
      .card-inner { background-color: #5555ff; }
      & /deep/ use { fill: #5555ff; }
    }

    &.special .card-inner {
      background-color: #000000;
    }

    .card-inner {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;

      .top-num,
      .bottom-num {
        color: white;
        font-weight: 900;
        font-size: 32px;
        margin: 0 8px;

        &.hasSvg {
          height: 40px;
          width: 40px;

          & /deep/ svg {
            height: 100%;
            width: 100%;
            padding: 8px 16px 8px 0;

            use {
              fill: #fff;
            }
          }
        }
      }

      .swoosh {
        flex-grow: 1;
        background-color: white;
        transform: rotate(45deg) scaleX(1.5) scaleY(1.5);
        clip-path: ellipse(25% 50% at 50% 50%);
      }

      .swish-num {
        color: black;
        position: absolute;
        width: 100%;
        text-align: center;
        font-weight: 900;
        font-size: 64px;
        top: 50%;
        transform: translateY(-50%);

        &.hasSvg {
          height: 70px;

          & /deep/ svg {
            height: 100%;
            width: 100%;
          }
        }
      }

      .bottom-num {
        transform: rotate(180deg);
        align-self: flex-end;
      }
    }
  }
</style>

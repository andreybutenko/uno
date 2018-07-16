<template>
  <div class="stack">
    <Card
      v-for="(card, i) in stack"
      :key="'field-' + i"
      :selectable="false"
      :animateDisabled="true"
      :color="card.color"
      :type="card.type"
      :style="{ zIndex: 8 - i, transform: 'rotate(' + getStackRotation(i, stack.length) + ') translate(-50%, -50%)' }"
      v-if="i < 8" />
  </div>
</template>

<script>
  import PersistentRotation from '@/lib/PersistentRotation';

  import Card from '@/components/Card';

  export default {
    name: 'CardStack',
    components: { Card },
    props: ['stack'],
    methods: {
      getStackRotation: PersistentRotation.getRotation.bind(PersistentRotation)
    }
  }
</script>

<style lang="scss" scoped>
  .stack {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    & /deep/ .card {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>

<template>
  <div class="card-back-hand">
    <CardBack
      v-for="i in iterable"
      :key="i"
      :selectable="false"
      :selected="selected == i" />
  </div>
</template>

<script>
  import CardBack from '@/components/CardBack';

  export default {
    name: 'CardBackHand',
    props: ['count', 'selected'],
    components: { CardBack },
    computed: {
      iterable() {
        const res = [];
        for(let i = 0; i < this.count; i++) {
          res.push(i);
        }
        return res;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-back-hand {
    display: flex;
    flex-direction: row;
  }
</style>

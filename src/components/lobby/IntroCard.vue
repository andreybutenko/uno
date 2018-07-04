<template>
  <div class="intro-card lobby-ui">
    <img class="koala" src="/static/koala-armsup.png" />
    <div class="text">Hi!<br/>Let's play Uno!</div>
  </div>
</template>

<script>
  export default {
    name: 'IntroCard'
  }
</script>

<style lang="scss" scoped>
  .intro-card {
    border: 1px solid black;
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: white;
    
    .koala {
      height: 200px;
      width: 200px;
      margin-top: -100px;
    }

    .text {
      font-family: 'Wendy One', sans-serif;
      font-size: 24px;
    }
  }
</style>

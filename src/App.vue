<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,900|Wendy+One|Josefin+Sans');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Josefin Sans', sans-serif;
  }

  .full-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .vbtn {
    font-family: 'Josefin Sans', sans-serif;
    background-color: white;
    border: 1px solid #bdc3c7;
    border-radius: 16px;
    padding: 8px 16px;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    color: black;
    display: inline-block;

    &:hover {
      background-color: #d2d9dd;
    }

    &:focus {
      border-color: #3498db;
    }

    &.vbtn-transparent {
      background-color: rgba(255, 255, 255, 0);

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    &.vbtn-green {
      background-color: #2ecc71;
    }

    &.vbtn-blue {
      background-color: #19B5FE;

      &:hover {
        background-color: #74b9ff;
      }
    }

    &.vbtn-large {
      font-size: 18px;
      padding: 16px 32px;
      border-radius: 32px;
    }
  }
</style>

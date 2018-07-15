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

  .lbtn {
    font-family: 'Josefin Sans', sans-serif;
    background: none;
    cursor: pointer;
    outline: none;
    border: 0;
    text-decoration: underline;
    color: #3498db;
    font-size: 16px;

    &:hover {
      color: #2980b9;
    }
  }

  .vbtn-group {
    display: flex;
    flex-direction: row;

    .vbtn {
      flex: 1;
      border-radius: 0;
      margin-right: 0;
      border-right-width: 0;

      &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-right-width: 1px;
      }
    }
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

      &:hover {
        background-color: #27ae60;
      }
    }

    &.vbtn-blue {
      background-color: #19B5FE;

      &:hover {
        background-color: #74b9ff;
      }
    }

    &.vbtn-compact {
      font-size: 12px;
      padding: 4px 8px;
    }

    &.vbtn-large {
      font-size: 18px;
      padding: 16px 32px;
    }

    &.vbtn-stacked-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 16px;

      svg {
        margin-bottom: 10px;
      }
    }
  }
</style>

<template>
  <div class="landing-container">
    <div class="landing-layout">
      <div class="landing-content">
        <h1>Uno!</h1>
        <p>
          A fun place to play Uno with your friends<br/>(and koala enthusiasts)
        </p>
        <div class="btn-container">
          <router-link to="/lobby/offline" class="vbtn vbtn-transparent">Play Offline</router-link>
          <router-link to="/lobby" class="vbtn vbtn-large vbtn-blue">Play Online</router-link>
        </div>
        <div class="footer-links">
          <a href="https://github.com/andreybutenko/uno" target="_blank">Open-Source</a>
        </div>
      </div>
      <img src="/static/curvy-border.svg" class="border" />
      <img src="/static/koala-tree.png" class="illustration" />
    </div>
  </div>
</template>

<script>
  import DeckBuilder from '@/../common/DeckBuilder';
  import Card from '@/components/Card';

  export default {
    name: 'Library',
    components: { Card },
    mounted() {
      const deck = DeckBuilder.createDeck();
      DeckBuilder.shuffleDeck(deck);
      this.deck = deck;
    },
    data () {
      return {
        deck: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .landing-container {
    width: 100vw;
    height: 100vh;
    //background: linear-gradient(90deg, rgba(17,214,255,1) 25%, rgba(46,30,128,1) 100%);
    background-image: url('/static/james-connolly-363036-unsplash.jpg');
    background-size: cover;
    background-position: center;

    .landing-layout {
      display: flex;
      flex-direction: row;
      height: 100%;

      .landing-content {
        background-position: right;
        background-size: contain;
        background-repeat: no-repeat;
        flex: 1;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 32px;
        position: relative;

        h1 {
          font-family: 'Wendy One';
          font-size: 64px;
        }

        p {
          font-size: 24px;
          text-align: center;
        }

        .btn-container {
          margin-top: 16px;
        } 

        .footer-links {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          text-align: right;

          a {
            color: #3498db;

            &:hover {
              color: #2980b9;
            }
          }

        }
      }

      .border {
        height: 100%;
      }

      .illustration {
        height: 100%;
      }     
    }
  }
</style>
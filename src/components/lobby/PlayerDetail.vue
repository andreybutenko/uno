<template>
  <div class="player lobby-ui">
    <h1>You</h1>

    <template v-if="nameEditEnabled == false">
      <div class="name"><b>Username:</b> {{ playerName }}</div>
      <div class="center-button">
        <button @click="editName()" class="vbtn">Change Name</button>
      </div>
    </template>
    <template v-else>
      <input class="name-edit" v-model="nameEdit" placeholder="User Name" />
      <div class="center-button">
        <button @click="applyEdit()" class="vbtn">Save Name</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PlayerDetail',
  props: ['playerName'],
  data() {
    return {
      nameEdit: '',
      nameEditEnabled: false
    };
  },
  methods: {
    editName() {
      this.nameEdit = this.playerName;
      this.nameEditEnabled = true;
    },
    applyEdit() {
      this.$socket.emit('setPlayerName', this.nameEdit);
      this.nameEditEnabled = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
    margin-bottom: 16px;
  }

  .player {
    background-color: #19B5FE;
    padding: 32px 16px;
  }

  .name {
    text-align: center;
  }

  .center-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .name-edit {
    font-family: 'Josefin Sans', sans-serif;
    text-align: center;
    display: block;
    width: 100%;
    padding: 16px;
  }

  button {
    margin-top: 16px;
  }
</style>

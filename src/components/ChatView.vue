<template>
  <div class="chat-view">
    <h1 class="chat-header">Chat</h1>
    <div class="chat-box">
      <div v-for="(message, i) in messages" :key="i" class="message">
        <span class="sender">{{ message.sender }}</span> <span class="content"></span>{{ message.content }}</span>
      </div>
    </div>
    <div class="compose-container">
      <input class="message-input" v-model="messageDraft" placeholder="Type a message..." />
      <button @click="sendMessage()" class="vbtn">Send</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ChatView',
    data() {
      return {
        messages: [],
        messageDraft: ''
      }
    },
    sockets: {
      newMessage(payload) {
        this.messages.push(payload);
      }
    },
    methods: {
      sendMessage() {
        if(this.messageDraft.length == 0) return;
        this.$network.emit('newMessage', this.messageDraft);
        this.messageDraft = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .chat-header {
    margin-top: 16px;
  }

  .chat-box {
    height: 200px;
    border: 1px solid #bdc3c7;
    overflow-y: scroll;
    margin-bottom: 10px;
    max-width: 400px;
    padding: 8px;

    .message {
      margin-bottom: 8px;

      .sender {
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }

  .compose-container {
    display: flex;
    flex-direction: row;

    .message-input {
      font-family: 'Josefin Sins', sans-serif;
      flex: 1;
      padding: 4px;
      margin-right: 8px;
      border: 1px solid #bdc3c7;
      padding: 8px 16px;
    }
  }
</style>

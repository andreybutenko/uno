<template>
  <div class="chat-view" :class="{ dark: dark }">
    <div class="chat-header">
      <h1>Chat</h1> <font-awesome-icon icon="times-circle" size="2x" v-if="onClose" @click="onClose" />
    </div>
    <div class="chat-box" v-chat-scroll>
      <div v-for="(message, i) in messages" :key="i" class="message">
        <span class="sender">{{ message.sender }}</span> <span class="content"></span>{{ message.content }}</span>
      </div>
    </div>
    <div class="compose-container">
      <input type="text" class="message-input" v-model="messageDraft" placeholder="Type a message..." @keyup.enter="sendMessage()" />
      <button @click="sendMessage()" class="vbtn">Send</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ChatView',
    props: ['dark', 'onClose'],
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
  .chat-view {
    display: flex;
    flex-direction: column;

    &.dark {
      background-color: rgba(0, 0, 0, 0.8);
      color: #dfe6e9;

      .chat-header {
        text-align: center;
      }

      .chat-box {
        border: 0;
      }
    }
  }

  .chat-header {
    display: flex;
    flex-direction: row;
    margin: 16px;

    h1 {
      flex: 1;
    }

    svg {
      cursor: pointer;
    }
  }

  .chat-box {
    flex: 1;
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
    padding: 16px;
    padding-top: 8px;

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

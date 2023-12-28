<template>
  <div class="side-panel">
    <div class="chat-gpt">
      <p v-if="!chatBotStatus.ready">{{ chatBotStatus.value }}</p>
      <div v-else class="section-chat">
        <textarea class="chat-input" rows="1"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { getChatBot } from '@/modules/chatBot'

export default {
  name: 'side-panel',
  data: () => ({
    chatBotStatus: { ready: false, value: '' }
  }),
  mounted() {
    this.chatBot = getChatBot((status) => {
      this.chatBotStatus = status
    })
    this.chatBotStatus = this.chatBot.status
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.chat-input {
  resize: none;
  width: 100%;
}
</style>

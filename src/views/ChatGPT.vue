<template>
  <div class="side-panel">
    <div class="chat-gpt">
      <p v-if="!chatBotStatus.ready">{{ chatBotStatus.value }}</p>
      <div v-else class="section-chat">
        <div ref="messageList" class="message-list">
          <ChatMessage
            v-for="(item, i) in messageList"
            :key="i"
            :node="item"
            @select="handleSelectMessage"
            @switch="handleSwitchMessage"
          ></ChatMessage>

          <p v-if="lastError" class="last-error">{{ lastError }}</p>
        </div>
        <div>
          <label>
            <input type="radio" v-model="template" value="chat" />
            chat
          </label>
          <label>
            <input type="radio" v-model="template" value="translate" />
            翻译
          </label>
          <label>
            <input type="radio" v-model="template" value="name" />
            命名
          </label>
        </div>
        <div class="chat-input">
          <textarea
            ref="input"
            rows="1"
            v-model="message"
            @input="handleInput"
            @keydown="handleKeydown"
          ></textarea>
          <button @click="sendMessage">☃</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChatBot } from '@/modules/chatBot'
import ChatMessage from '@/views/components/ChatMessage.vue'

function useMessage(cb) {
  chrome.runtime.onMessage.addListener(cb)
  return () => chrome.runtime.onMessage.removeListener(cb)
}

export default {
  name: 'side-panel',
  components: {
    ChatMessage
  },
  data: () => ({
    chatBotStatus: { ready: false, value: '' },
    message: '',
    responding: false,
    respondingMessage: '',
    lastError: null,
    template: 'chat',
    messageList: []
  }),
  watch: {
    message(v) {
      this.$refs.input.value = v
      this.$refs.input.dispatchEvent(new InputEvent('input'))
    }
  },
  mounted() {
    this.chatBot = getChatBot({
      onStatusChange: this.onStatusChange.bind(this)
    })
    this.closeMessage = useMessage((msg) => {
      if (
        msg.type === 'CONTENT_SCRIPT_SELECTION_TEXT' &&
        this.template === 'translate'
      ) {
        this.message = `请你扮演中英互译专家，帮我翻译下面这段文字：\n${msg.payload}`
      }
    })

    window.vm = this
  },
  beforeUnmount() {
    this.closeMessage()
  },
  methods: {
    onStatusChange(status) {
      this.chatBotStatus = status
      if (status.ready) {
        this.messageList = this.chatBot.getMessageList()
        this.scrollMessageListToBottom()
      }
    },
    sendMessage() {
      const message = this.message.trim()
      if (!message) return

      this.message = ''
      this.lastError = null

      let lastIndex = this.messageList.length + 1
      this.chatBot
        .chat(message, {
          onMessage: (node) => {
            node.respondingMessage = node.message.content.parts.join('')
            this.messageList.splice(lastIndex, 1, { ...node })

            this.scrollMessageListToBottom()
          },
          onSend: (node) => {
            this.messageList.push(node)
            this.messageList.push({
              message: { status: 'in_progress', author: { role: 'assistant' } }
            })
            this.responding = true
            this.scrollMessageListToBottom()
          }
        })
        .then((res) => {
          console.log('chat done', res, this.messageList)
        })
        .catch((err) => {
          this.lastError = err.message
        })
        .finally(() => {
          this.responding = false
          this.scrollMessageListToBottom()
        })
    },
    scrollMessageListToBottom() {
      this.$nextTick(() => {
        this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight
      })
    },
    handleKeydown(ev) {
      if (ev.key === 'Enter') {
        if (ev.isComposing || ev.keyCode === 229) {
          return
        }

        if (ev.metaKey || ev.ctrlKey) {
          ev.target.value += '\n'
          ev.target.dispatchEvent(new InputEvent('input'))
          return
        }

        ev.preventDefault()
        this.sendMessage()
        return
      }
    },
    handleInput(ev) {
      const el = ev.target
      el.style.height = '1px'
      el.style.height = el.scrollHeight + 'px'
      el.scrollTop = el.scrollHeight
    },
    handleSelectMessage(node) {
      this.chatBot.setCurrentNode(node.id)
      this.messageList = this.chatBot.getMessageList()
    },
    handleSwitchMessage(activeNode) {
      this.chatBot.switchMessage(activeNode)
      this.messageList = this.chatBot.getMessageList()
    }
  }
}
</script>
<style>
body {
  margin: 0;
}
</style>
<style lang="scss" scoped>
.side-panel {
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chat-gpt {
  height: 100%;
  flex: 1 1 auto;
}
.section-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-input {
  position: relative;
  border: 1px solid rgba(217, 217, 227, 0.8);
  margin: 16px 0;

  textarea {
    width: 100%;
    resize: none;
    font-size: 12px;
    line-height: 24px;
    padding: 10px 48px 10px 12px;
    max-height: 100px;
    box-sizing: border-box;
    border: none;
  }
  textarea:focus-visible {
    outline: none;
  }

  button {
    position: absolute;
    right: 8px;
    top: 6px;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    background: gainsboro;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
  }
  button:active {
    opacity: 0.8;
  }
}
.message-list {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 64px;

  .message.system {
    display: none;
  }
}
</style>

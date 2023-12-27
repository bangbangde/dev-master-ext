<template>
  <div class="side-panel">
    <p>{{ info }}</p>
  </div>
</template>

<script>
import { useConnect } from '@/modules/connect'
import { CONNECT_NAME, MESSAGE_TYPE } from '@/modules/consts'
export default {
  name: 'side-panel',
  data: () => ({
    info: '',
    templates: [
      { name: 'chat', label: '聊天' },
      { name: 'translate', label: '翻译' }
    ]
  }),
  created() {
    this.responding = {}
    this.onMessage = this.onMessage.bind(this)
    this.connect = useConnect(
      CONNECT_NAME.SIDE_PANEL__SERVICE_WORKER,
      this.onMessage
    )
  },
  methods: {
    handleResponse(payload) {
      if (payload.end === true) {
        this.responding = null
      }
    },
    postMessage(type, payload, onMessage) {
      const id = this.connect.postMessage(type, payload)
      if (onMessage) {
        this.responding[id] = onMessage
      }
    },
    onMessage(message, port) {
      const { type, payload } = message
      if (type === MESSAGE_TYPE.RESPONSE) {
        const { id, data } = payload
        if (!this.responding.hasOwnProperty(id)) return
        this.this.responding[id](payload)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <div v-if="node.message" class="chat-message" :class="[node.message.status]">
    <div class="msg-content" @click="$emit('select', node)">
      <div class="role">{{ role }}</div>
      <div class="content-text">
        {{ node.respondingMessage || content }}
        <span v-if="node.message.status === 'in_progress'">...</span>
      </div>
    </div>
    <div v-if="childNodes && childNodes.length > 1" class="children-switch">
      <span
        v-for="(item, i) in childNodes"
        :key="i"
        :class="['child-index', { active: item.active }]"
        @click="$emit('switch', item.id)"
      >
        {{ i + 1 }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    node: Object
  },
  data: () => ({}),
  computed: {
    role() {
      return this.node?.message?.author?.role
    },
    content() {
      return this.node?.message?.content?.parts?.join('')
    },
    childNodes() {
      if (!this.node?.children?.length) return null
      return this.node.children.map((id) => ({
        id,
        active: this.node.activeNode === id
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message {
  .msg-content {
    color: #333333;
    .role {
      font-size: 16px;
      font-weight: bolder;
    }
    .content-text {
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 14px;
    }
  }
  .children-switch {
    margin-top: 8px;
    .child-index {
      padding: 0 8px;
      cursor: pointer;
      &.active {
        color: darkorange;
      }
    }
  }
}
</style>

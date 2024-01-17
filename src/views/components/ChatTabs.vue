<template>
  <div class="view-chat-tabs">
    <div class="tabs-header">
      <div
        class="tab-item"
        v-for="item in tabs"
        :key="item.key"
        :class="[item.key]"
      >
        {{ item.label }}
      </div>
    </div>

    <div v-show="activeTab === 'translate'" class="tab-content translate">
      <textarea v-model="translate.input"></textarea>
      <div class="form">
        <label>
          <input type="checkbox" v-model="translate.detail" /> 详细解析
        </label>

        <button type="button" @click="translateSubmit">翻译</button>
      </div>
      <p class="result" v-if="translate.result">{{ translate.result }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatTabs',
  data: () => ({
    tabs: [
      { label: '翻译', key: 'translate' },
      { label: '命名', key: 'name' }
    ],
    activeTab: 'translate',
    translate: {
      input: '',
      detail: false,
      result: ''
    }
  }),
  methods: {
    translateSubmit() {
      console.log(this.translate)
    }
  }
}
</script>

<style lang="scss" scoped>
.view-chat-tabs {
  padding: 24px;
}
.tabs-header {
  display: flex;
  .tab-item {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    font-size: 14px;
    line-height: 28px;
    border-radius: 8px 8px 0 0;
    border: 1px solid gainsboro;
    background-color: antiquewhite;
  }
}
.translate {
}
.translate textarea {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  border: 1px solid #57ad19;
  &:focus-visible {
    outline: none;
  }
}
.form {
  display: flex;
  justify-content: flex-end;
  & > * {
    margin: 4px;
  }
}
.form label {
  display: flex;
  align-items: center;
}

.result {
  padding: 16px;
  border: 1px solid #33333333;
  border-radius: 8px;
  white-space: pre-wrap;
}
</style>

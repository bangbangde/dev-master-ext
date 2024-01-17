<template>
  <div class="page popup">
    <header>
      <h2>WebDev Master</h2>
    </header>

    <a href="index.html" target="_blank">Home</a> <br />
    <a href="index.html#/storage" target="_blank">Storage</a> <br />
    <a href="javascript:void(0);" @click="openSidePanel">Side Panel</a>

    <footer>
      @ 2023 Frank - <a href="options.html" target="_blank">扩展程序选项</a> -
      <a href="https://github.com/bangbangde" target="_blank">Github</a>
      <a
        href="https://developer.chrome.com/docs/extensions/reference/api"
        target="_blank"
      >
        extensions api
      </a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'page-popup',
  methods: {
    async openSidePanel(ev) {
      ev.preventDefault()
      const tabs = await chrome.tabs.query({ active: true })
      await chrome.sidePanel.open({
        tabId: tabs[0].id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page.popup {
  footer {
    white-space: nowrap;
    margin-top: 16px;
  }
}
</style>

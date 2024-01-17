<template>
  <div class="side-panel">
    <router-view></router-view>
    <div class="fab">
      <div class="fab-container">
        <button @click="reload">RELOAD</button>
        <button @click="open">OPEN IN TAB</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'side-panel',
  data: () => ({
    url: chrome.runtime.getURL('side-panel.html')
  }),
  methods: {
    reload() {
      console.log(location)
      location.reload()
    },
    open() {
      window.open(chrome.runtime.getURL('pages/side-panel.html'))
    }
  }
}
</script>
<style lang="scss" scoped>
.side-panel {
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .fab {
    position: fixed;
    right: -16px;
    bottom: 16px;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background-color: darkorange;
    overflow: visible;

    .fab-container {
      position: absolute;
      right: 0;
      bottom: 0;
      display: none;
      padding-bottom: 32px;
      padding-right: 32px;
    }

    &:hover {
      right: 0px;
      .fab-container {
        display: block;
      }
    }
  }
}
</style>

<template>
  <div class="page popup">
    <header>
      <h2>WebDev Master</h2>
    </header>
    <footer>
      @ 2023 Frank
      - <a href="options.html" target="_blank">扩展程序选项</a>
      - <a href="https://github.com/bangbangde" target="_blank">Github</a>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'page-popup'
  }
</script>

<style lang="scss" scoped>
.page.popup {
  footer {
    white-space: nowrap;
  }
}
</style>
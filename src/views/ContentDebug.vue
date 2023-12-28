<template>
  <div class="content-debug">version: 0.0.1</div>
</template>

<script>
import { addSelectionChangeListener } from '@/utils/selectHandler'
import { useStorageCache } from '@/modules/storage'

export default {
  name: 'content-debug',
  data: () => ({})
}
</script>

<style lang="scss" scoped>
.content-debug {
  color: red;
}
</style>

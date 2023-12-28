<template>
  <div>
    <MonacoEditor :code="jsonStr" language="json" />
    <ol>
      <li v-for="item in changeRecords">
        <i>{{ item }}</i>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import MonacoEditor from '@/views/components/MonacoEditor.vue'

const data = reactive({})

const changeRecords = ref([])

const jsonStr = computed(() => {
  return JSON.stringify(data, null, 4)
})

chrome.storage.local.get().then((items) => {
  Object.assign(data, items)
})

chrome.storage.local.onChanged.addListener((changes, area) => {
  changeRecords.value.push(changes)
  Object.entries(changes).forEach(([k, v]) => {
    data[k] = v.newValue
  })
})
</script>

<style lang="scss" scoped>
code {
  font-size: 20px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

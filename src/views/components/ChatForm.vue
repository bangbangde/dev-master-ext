<template>
  <div></div>
</template>

<script setup>
const blueprints = [
  {
    id: '0',
    desc: '实验',
    version: 0,
    fields: {
      source: {
        type: 'string',
        inputType: 'text'
      }
    },
    template: `请扮演软件开发领域的中英互译专家，按以下要求提供翻译服务：
---
如果原文是英文：
1. 如果是一个单词或词组，请同时提供该单词的音标，必要的话同时给予发音提示。
2. 如果原文中包含长难句，请解析。
3. 如果原文有任何错误或不合理之处，请指出。

如果原文是中文：
1. 注意考虑可能的上下文环境，给出地道的翻译。

现在请帮我翻译这段原文：“{{source}}”。`
  }
]
</script>

<style lang="scss" scoped></style>

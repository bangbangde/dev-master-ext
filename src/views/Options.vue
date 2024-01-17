<template>
  <div class="view-options">
    <form @submit="handleSubmit">
      <div class="row">
        <md-outlined-text-field
          label="ChatGPT token"
          :value="formData[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]"
          @input="
            formData[STORAGE_KEY.CHAT_GPT_WEB_TOKEN] = $event.target.value
          "
        ></md-outlined-text-field>
      </div>

      <div class="row buttons">
        <md-outlined-button type="submit">Submit</md-outlined-button>
      </div>
    </form>
  </div>
</template>

<script>
import '@material/web/button/outlined-button.js'
import '@material/web/button/text-button.js'
import '@material/web/icon/icon.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/switch/switch.js'
import { STORAGE_KEY } from '@/modules/consts'

export default {
  name: 'Options',
  data: () => ({
    STORAGE_KEY,
    formData: {
      [STORAGE_KEY.CHAT_GPT_WEB_TOKEN]: null
    }
  }),
  mounted() {
    const keys = Object.keys(this.formData)
    chrome.storage.local.get(keys).then((items) => {
      keys.forEach((key) => {
        if (key in items) {
          this.formData[key] = items[key]
        }
      })
    })
  },
  methods: {
    handleSubmit(ev) {
      event.preventDefault()
      chrome.storage.local
        .set({ ...this.formData })
        .then(() => {
          console.log('success')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.view-options {
  form {
    max-width: 500px;
    margin: 32px auto;
  }
  .row {
    margin: 16px 0;
    & > * {
      display: block;
    }
  }
  .switch-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }
  .row.buttons {
    display: flex;
    margin-top: 32px;
    justify-content: flex-end;
  }
}
</style>

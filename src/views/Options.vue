<template>
  <div class="view-options">
    <form @submit="handleSubmit">
      <div class="row">
        <md-outlined-text-field
          label="ChatGPT token"
          :value="formData.chatGPTToken"
          @input="formData.chatGPTToken = $event.target.value"
        ></md-outlined-text-field>
      </div>
      <div class="row">
        <label class="switch-label">
          打印日志
          <md-switch
            :selected="formData.allowLogger"
            @change="formData.allowLogger = $event.target.selected"
          ></md-switch>
        </label>
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
    formData: {
      allowLogger: false,
      chatGPTToken: null
    }
  }),
  mounted() {
    chrome.storage.local.get(STORAGE_KEY.OPTIONS).then((items) => {
      console.log({ items })
      if (items[STORAGE_KEY.OPTIONS]) {
        Object.assign(this.formData, items[STORAGE_KEY.OPTIONS])
      }
    })
  },
  methods: {
    handleSubmit(ev) {
      event.preventDefault()
      chrome.storage.local
        .set({
          [STORAGE_KEY.OPTIONS]: this.formData
        })
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

<template>
  <div class="step-3">
    <table class="table-striped">
      <thead>
        <tr>
          <th>Exchange Order# (Double Click to Copy)</th>
          <th>Note (Double Click to Copy)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in barcodes" class="{{item.isFound ? 'duplicate' : 'exchange'}}">
          <td v-on:dblclick="copyTarget" style="cursor: pointer">{{item.code}}</td>
          <td v-on:dblclick="copyTarget" style="cursor: pointer">{{item.note}}</td>
          <td>Pending</td>
        </tr>
      </tbody>
    </table>
    <webview id="webview" src="about:blank" autosize="on" nodeintegration></webview>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        webview: null,
        webviewLoaded: false,
        content: null
      }
    },
    vuex: {
      getters: {
        barcodes: ({ barcode }) => barcode.exchangeList
      },
      actions: {
        SET_RETURNS_LIST: ({ dispatch }, list) => dispatch('SET_RETURNS_LIST', list)
      }
    },
    methods: {
      webviewReady () {
        let webview = document.getElementById('webview')
        webview.addEventListener('dom-ready', () => {
          if (this.webviewLoaded) { return }
          webview.loadURL('http://tipsyelves.com/admin')
          this.webviewLoaded = true
          // webview.openDevTools()
          webview.executeJavaScript(this.injectJquery(), null, this.login(webview))
        })
      },
      copyTarget (event) {
        this.$electron.clipboard.writeText(event.target.textContent)
        console.debug('copied to clipboard: ', event.target.textContent)
      },
      login (webview) {
        /*eslint-disable quotes*/
        let login = `
          document.querySelector('#username').value = 'Example Username from TypsyApp!';
          document.querySelector('#login').value = '123';
          // setTimeout(function() {document.querySelector('form').submit()}, 2000);`
        webview.executeJavaScript(login)

        function loggedIn () {
          console.debug('url: ', webview.getURL())
          // webview.removeEventListener('did-navigate', loggedIn)
        }

        webview.addEventListener('did-navigate', loggedIn)
      },
      injectJquery () {
        return `var jq=document.createElement("script");jq.src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",document.getElementsByTagName("head")[0].appendChild(jq),jQuery.noConflict();`
      },
      search () {
        console.debug('hello sent')
      }
    },
    ready () {
      this.webviewReady()
    }
  }
</script>

<style scoped>
  webview {
    display: inline-flex;
    width: 100%;
    height: 75vh;
    border: 2px solid black;
  }
</style>

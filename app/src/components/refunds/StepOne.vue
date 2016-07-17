<template>
  <div class="container">
    <div class="capture">
      <div class="capture__preview">
        <p>Barcode Preview:</p>
        <div class="cature__preview--image">
          <div class="image-container">
            <img :src="image" alt="Barcode Capture"/>
          </div>
          <input type="text" class="capture-status" v-model="status.message">
        </div>
      </div>
      <button class="btn btn-large btn-primary" @click="onCaptureBarcode">Start Capture | &#8984;⌥ + B</button>
    </div>
    <div class="capture__table">
      <table class="table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Barcode</th>
            <th>Adjusted Code</th>
            <th>Notes</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="barcode in barcodes">
            <td>{{$index + 1}}</td>
            <td>{{barcode.code}}</td>
            <td><strong>{{adjustCode(barcode.code)}}</strong></td>
            <td @click="onOpenNote($index)">{{barcode.notes ? barcode.notes : 'Click to edit note'}}</td>
            <td @click="onRemoveBarcode($index)"><span class="icon icon-cancel"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <textarea name="name" rows="10" cols="20" v-model="barcodeList"></textarea>
    <button class="btn btn-large btn-default" type="button" name="button" @click="copyToClip">Copy to clipboard</button>
    <button class="btn btn-large btn-primary" type="button" name="button" v-link="'/refunds/step-two'">Proceed to Step 2</button>
    <dialog class="mdl-dialog">
      <form @submit.prevent="onAddNote">
        <h4 class="mdl-dialog__title">Add Note</h4>
        <div class="mdl-dialog__content">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" v-model="noteMessage" id="note">
            <label class="mdl-textfield__label" for="note">Add Note</label>
          </div>
        </div>
        <div class="mdl-dialog__actions">
          <button type="submit" class="mdl-button">Add</button>
          <button type="button" class="mdl-button close" @click.prevent="onCloseNote">Cancel</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script>
/* globals Quagga */
import sh from 'shelljs'

export default {
  name: 'refunds',
  data () {
    return {
      image: '',
      status: '',
      noteIndex: null,
      noteMessage: ''
    }
  },
  vuex: {
    getters: {
      barcodes: ({ barcode }) => barcode.list
    },
    actions: {
      addBarcode: ({ dispatch }, payload) => dispatch('ADD_BARCODE', payload),
      removeBarcode: ({ dispatch }, payload) => dispatch('REMOVE_BARCODE', payload),
      updateNote: ({ dispatch }, payload) => dispatch('UPDATE_NOTE', payload)
    }
  },
  computed: {
    barcodeList () {
      let barcodes = this.barcodes.map(barcode => `${this.adjustCode(barcode.code)}\t${barcode.notes}`)
      return barcodes.join('\n')
    }
  },
  methods: {
    onCaptureBarcode () {
      this.status = { message: '', status: '' }
      sh.exec('screencapture -scx', (code, stdout, stderr) => {
        let capturedImage = this.$electron.clipboard.readImage().toDataURL()
        this.image = capturedImage
        Quagga.decodeSingle({
          decoder: {
            readers: ['code_39_reader']
          },
          locate: true,
          src: capturedImage
        }, result => {
          if (!result) {
            this.status = { message: 'No Barcode Detected', status: 'danger' }
            return
          }
          if (result.codeResult) {
            let duplicates = this.barcodes.filter(barcode => barcode.code === result.codeResult.code)
            if (duplicates.length) {
              this.status = { message: 'Already Scanned', status: 'alert' }
              return
            }

            result.codeResult = Object.assign(result.codeResult, { notes: '' })

            this.addBarcode(result.codeResult)
            this.onOpenNote(this.barcodes.length - 1)
            this.status = { message: `Success: ${result.codeResult.code}`, status: 'success' }
          } else {
            this.status = { message: 'Could Not Read', status: 'alert' }
          }
        })
      })
    },
    adjustCode (code) {
      return code.substring(6).replace(/1/, '100')
    },
    onOpenNote (index) {
      let dialog = document.querySelector('.mdl-dialog')
      this.noteIndex = index
      dialog.showModal()
    },
    onAddNote () {
      this.updateNote({ index: this.noteIndex, note: this.noteMessage })
      this.onCloseNote()
    },
    onRemoveBarcode (index) {
      let removedBarcode = this.barcodes[index]
      this.removeBarcode(removedBarcode)
    },
    onCloseNote () {
      let dialog = document.querySelector('.mdl-dialog')
      this.noteIndex = null
      this.noteMessage = ''
      dialog.close()
    },
    copyToClip () {
      this.$electron.clipboard.writeText(this.barcodeList)
    }
  },
  ready () {
    this.$electron.remote.globalShortcut.register('CommandOrControl+Alt+B', () => {
      this.onCaptureBarcode()
    })
    window.componentHandler.upgradeAllRegistered()
  },
  beforeDestroy () {
    this.$electron.remote.globalShortcut.unregisterAll()
  }
}
</script>

<style scoped>
  .notes-input {
    width: 100%;
  }
  .icon-cancel {
    font-size: 20px;
  }
</style>

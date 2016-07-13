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
      <button class="btn btn-large btn-primary" @click="handleFile">Start Capture</button>
    </div>
    <div class="capture__table">
      <table class="table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Barcode</th>
            <th>Adjusted Code</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="barcode in barcodes" @click="onOpenNote($index)">
            <td>{{$index + 1}}</td>
            <td>{{barcode.code}}</td>
            <td><strong>{{adjustCode(barcode.code)}}</strong></td>
            <td>{{barcode.notes ? barcode.notes : 'Click to add note'}}</td>
            <td><span class="icon icon-check"></span><span class="icon icon-cancel"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <textarea name="name" rows="10" cols="20" v-model="barcodeList"></textarea>
    <button type="button" name="button" @click="copyToClip">Copy to clipboard</button>
    <dialog class="mdl-dialog">
    <div class="mdl-dialog__content">
      <div class="mdl-textfield mdl-js-textfield">
        <textarea class="mdl-textfield__input" type="text" v-model="noteMessage" rows= "2" id="note" ></textarea>
        <label class="mdl-textfield__label" for="note">Add Note...</label>
      </div>
    </div>
    <div class="mdl-dialog__actions">
      <button type="button" class="mdl-button" @click="onAddNote">Add</button>
      <button type="button" class="mdl-button close" @click="onCloseNote">Cancel</button>
    </div>
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
      result: {},
      status: '',
      barcodes: [],
      noteIndex: null,
      noteMessage: ''
    }
  },
  computed: {
    barcodeList () {
      let barcodes = this.barcodes.map(barcode => `${this.adjustCode(barcode.code)}\t${barcode.notes}`)
      return barcodes.join('\n')
    }
  },
  methods: {
    handleFile () {
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
            console.log(duplicates.length)
            if (duplicates.length) {
              this.status = { message: 'Already Scanned', status: 'alert' }
              return
            }

            result.codeResult = Object.assign(result.codeResult, { notes: '' })
            this.barcodes.push(result.codeResult)
            this.result = result
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
      this.barcodes[this.noteIndex].notes = this.noteMessage
      this.onCloseNote()
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
    window.componentHandler.upgradeAllRegistered()
  }
}
</script>

<style scoped>
  .notes-input {
    width: 100%;
  }
</style>

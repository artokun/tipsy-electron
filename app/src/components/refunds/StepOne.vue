<template>
  <div class="">
    <button class="btn btn-large btn-primary" @click="handleFile">Capture Barcode</button>
    <img :src="image" alt="" height="100"/>
  </div>
</template>

<script>
/* globals Quagga */
import sh from 'shelljs'

export default {
  name: 'refunds',
  data () {
    return {
      image: ''
    }
  },
  methods: {
    handleFile () {
      sh.exec('screencapture -scx', (code, stdout, stderr) => {
        let capturedImage = this.$electron.clipboard.readImage().toDataURL()

        Quagga.decodeSingle({
          decoder: {
            readers: ['code_39_reader'] // List of active readers
          },
          locate: true, // try to locate the barcode in the image
          src: capturedImage // or 'data:image/jpg;base64,' + data
        }, function (result) {
          if (result.codeResult) {
            console.log('result', result.codeResult.code)
          } else {
            console.log('not detected')
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="">
    <button class="btn btn-large btn-primary" @click="handleFile">Capture Barcode</button>
    <img :src="image" alt="" height="100"/>
  </div>
</template>

<script>
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
        this.image = this.$electron.clipboard.readImage().toDataURL()
        // handle QuaggaJS for barcode decode
        // https://serratus.github.io/quaggaJS/
      })
    }
  }
}
</script>

<style scoped>

</style>

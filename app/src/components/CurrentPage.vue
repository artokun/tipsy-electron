<template>
  <div>
    <button type="file" name="name" @click="handleFile()">Do the thing</button>
    <img v-show="image" :src="image" alt="" />
  </div>
</template>

<script>
  import sh from 'shelljs'

  export default {
    name: 'landing-page',
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
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

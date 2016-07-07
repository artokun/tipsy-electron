<template>
  <div>
    <button type="file" name="name" @click="handleFile()">Do the thing</button>
    <pre>
      {{ name }}
      {{ exec }}
    </pre>
  </div>
</template>

<script>
  import sh from 'shelljs'

  export default {
    name: 'landing-page',
    data () {
      return {
        exec: ''
      }
    },
    methods: {
      handleFile () {
        // this.exec = exec('screencapture -scx')
        sh.exec('screencapture -scx', (code, stdout, stderr) => {
          console.log('Exit code:', code)
          console.log('Program output:', stdout)
          console.log('Program stderr:', stderr)
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

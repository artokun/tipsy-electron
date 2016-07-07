<template>
  <div>
    <h1>Welcome.</h1>
    <current-page></current-page>
  </div>
</template>

<script>
  import CurrentPage from './CurrentPage'

  export default {
    components: {
      CurrentPage
    },
    name: 'landing-page'
  }
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

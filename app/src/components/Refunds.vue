<template>
  <div class="pane-sm sidebar">
    <ul class="list-group">
      <li class="list-group-header" v-link="'/refunds'">
        <h4>Refund Flow</h4>
      </li>
      <li class="list-group-item" v-link="'/refunds/step-one'">
        <img class="img-circle media-object pull-left" src="../assets/images/avatar.jpg" width="32" height="32">
        <div class="media-body">
          <strong>Step 1</strong>
          <p>Capture barcodes</p>
        </div>
      </li>
      <li class="list-group-item" v-link="'/refunds/step-two'">
        <img class="img-circle media-object pull-left" src="../assets/images/avatar2.png" width="32" height="32">
        <div class="media-body">
          <strong>Step 2</strong>
          <p>Remove exchanges from</p>
          <p>returns list</p>
        </div>
      </li>
      <li class="list-group-item" v-link="'/refunds/step-three'">
        <img class="img-circle media-object pull-left" src="../assets/images/avatar3.jpg" width="32" height="32">
        <div class="media-body">
          <strong>Step 3</strong>
          <p>Log into Magento and</p>
          <p>step through the exchanges</p>
        </div>
      </li>
      <li class="list-group-item" v-link="'/refunds/step-four'">
        <img class="img-circle media-object pull-left" src="../assets/images/avatar4.jpg" width="32" height="32">
        <div class="media-body">
          <strong>Step 4</strong>
          <p>Lastly step through</p>
          <p>the rest of the returns</p>
        </div>
      </li>
    </ul>
  </div>
  <div class="pane">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'refunds'
  }
</script>

<style lang="scss" scoped>
  .list-group-item {
    cursor: pointer;
    transition: padding .5s ease-in-out, background-color .3s ease-in-out;
    .media-body, .media-object, strong, p {
      cursor: pointer;
    }
    &:hover {
      background-color: aliceblue;
    }
    &.v-link-active {
      background-color: lightblue;
      padding: 30px 10px;
      transition: padding .5s ease-in-out, background-color .3s ease-in-out;
    }
  }
  .pane {
    display: block;
  }
</style>

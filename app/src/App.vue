<template>
  <div>
    <div class="window">
      <header class="toolbar toolbar-header">
        <h1 class="title">Tipsy Elves Helper App</h1>

        <div class="toolbar-actions">
          <div class="btn-group">
            <button class="btn btn-default" v-link="{ path: '/', activeClass: 'active', exact: true }">
              <span class="icon icon-home"></span>
            </button>
            <button class="btn btn-default" v-link="{ path: '/refunds', activeClass: 'active' }">
              <span class="icon icon-folder"></span>
            </button>
            <button class="btn btn-default" v-link="{ path: '/coming-soon', activeClass: 'active' }">
              <span class="icon icon-cloud"></span>
            </button>
            <button class="btn btn-default" v-link="{ path: '/coming-soon' }">
              <span class="icon icon-popup"></span>
            </button>
            <button class="btn btn-default" v-link="{ path: '/coming-soon' }">
              <span class="icon icon-shuffle"></span>
            </button>
          </div>

          <button class="btn btn-default">
            <span class="icon icon-home icon-text"></span>
            Filters
          </button>

          <button class="btn btn-default btn-dropdown pull-right">
            <span class="icon icon-megaphone"></span>
          </button>
        </div>
      </header>
      <div class="window-content">
        <div class="pane-group">
          <router-view></router-view>
        </div>
      </div>
      <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
          Prototype v1.0.0
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  import store from 'src/vuex/store'
  export default {
    store
  }
</script>

<style lang="scss">
  @import 'assets/styles/photon.min.css';
  @import url(https://code.getmdl.io/1.1.3/material.green-light_green.min.css);
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  html,
  body { height: 100%; }

  body {
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
  }
</style>

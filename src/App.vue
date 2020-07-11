<template>
  <div id="app">
    <router-view @authenticated='setAuthenticated' @logout='logout'/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'App' })
export default class App extends Vue {
  authenticated = false

  setAuthenticated (status: boolean) {
    this.authenticated = status
  }

  logout () {
    localStorage.removeItem('email')
    this.authenticated = false
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

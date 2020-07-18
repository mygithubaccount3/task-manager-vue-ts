<template>
  <div class="header">
    <AlertModal v-if="alert">{{this.alert}}</AlertModal>
    <span class="header__userEmail">&lt;{{this.email}}&gt;</span>
    <button @click="logout" class="header__btnLogout">LogOut</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import AlertModal from './AlertModal.vue'

@Component({ components: { AlertModal } })
export default class Header extends Vue {
  @Prop() private email!: string;

  get alert () {
    return this.$store.state.alert
  }

  logout () {
    if (localStorage) {
      try {
        localStorage.removeItem('email')
        this.$router.replace('login')
      } catch (e) {
        this.$store.commit('showError', `Error occured: ${e.message}`)
      }
    } else {
      this.$store.commit('showError', 'Your browser does not support localStorage')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  padding-top: 10px;
  padding-bottom: 10px;

  &__userEmail {
    margin-left: 10px;
  }

  &__btnLogout {
    background-color: white;
    border: 1px solid #000000;
    border-radius: 5px;
    margin-right: 10px;
    padding: 5px 30px;
    text-decoration: none;
  }
}
</style>

<template>
  <div class="contentWrapper">
    <AlertModal v-if="alert">{{this.alert}}</AlertModal>
    <Drawer
      @openDrawer="openDrawer"
      @closeDrawer="closeDrawer"
      :showDrawer="showDrawer"
      :id="id"
      :title="titleInput"
      :text="descriptionInput"
    />
    <Header :email="email" />
    <Cards @openEditingDrawer="openEditingDrawer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Drawer from '../components/Drawer.vue'
import Header from '../components/Header.vue'
import Cards from '../components/Cards.vue'
import AlertModal from '../components/AlertModal.vue'

@Component({ name: 'Home', components: { Drawer, Header, Cards, AlertModal } })
export default class Home extends Vue {
  email: string | null = '';
  descriptionInput = '';
  titleInput = '';
  id = '';
  showDrawer = false;

  get alert () {
    return this.$store.state.alert
  }

  created () {
    if (localStorage) {
      try {
        this.email = localStorage.getItem('email')
      } catch (e) {
        this.$store.commit('showError', `Error occured: ${e.message}`)
      }
    } else {
      this.$store.commit('showError', 'Your browser does not support localStorage. The app will not work')
    }

    if (!this.email) {
      this.$router.replace('login')
    }
  }

  openDrawer () {
    this.showDrawer = true
  }

  openEditingDrawer ({ id, title, text }: { id: string; title: string; text: string }) {
    this.id = id
    this.titleInput = title
    this.descriptionInput = text
    this.openDrawer()
  }

  closeDrawer () {
    this.showDrawer = false
    this.id = ''
    this.titleInput = ''
    this.descriptionInput = ''
  }
}
</script>

<style lang="scss" scoped>
.contentWrapper {
  min-height: 150px;
  position: relative;
}
</style>

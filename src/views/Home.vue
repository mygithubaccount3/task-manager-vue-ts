<template>
  <div class="contentWrapper">
    <Drawer
      @openDrawer="openDrawer"
      @closeDrawer="closeDrawer"
      :showDrawer="showDrawer"
      :drawerForCreatingColumn="drawerForCreatingColumn"
      :card="{id, title, text, imgURL, parentColumn}"
    />
    <Header :email="email" @openDrawer="openDrawer"/>
    <div class="cardListsWrapper">
      <CardList v-for="columnTitle in columns" :columnTitle="columnTitle" :key="columnTitle" @openEditingDrawer="openEditingDrawer"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { CardInterface } from '../interfaces/Card'
import Drawer from '../components/Drawer.vue'
import Header from '../components/Header.vue'
import CardList from '../components/CardList.vue'

@Component({ name: 'Home', components: { Drawer, Header, CardList } })
export default class Home extends Vue {
  email: string | null = '';
  text = '';
  title = '';
  id = '';
  imgURL = '';
  parentColumn = '';
  showDrawer = false;
  drawerForCreatingColumn = false;

  get columns () {
    return this.$store.state.columns
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

    this.$store.dispatch('fetchAllCards')
  }

  openDrawer (drawerForCreatingColumn: boolean) {
    this.showDrawer = true
    this.drawerForCreatingColumn = drawerForCreatingColumn
  }

  openEditingDrawer (card: CardInterface) {
    this.id = card.id
    this.title = card.title
    this.text = card.text
    this.imgURL = card.imgURL
    this.parentColumn = card.parentColumn
    this.openDrawer(false)
  }

  closeDrawer () {
    this.showDrawer = false
    this.id = ''
    this.title = ''
    this.text = ''
    this.imgURL = ''
    this.parentColumn = ''
  }
}
</script>

<style lang="scss" scoped>
.contentWrapper {
  min-height: 150px;
  position: relative;
}

.cardListsWrapper {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 20px;
}
</style>

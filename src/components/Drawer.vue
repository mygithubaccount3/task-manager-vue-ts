<template>
  <div class="drawerWrapper">
    <button class="btnOpenDrawer" @click="openDrawer">
      <font-awesome-icon icon="plus-circle" size="3x" />
    </button>
    <Popup v-if="showPopup" @closePopup="togglePopup" @saveImage="saveImage"/>
    <div class="drawer" v-if="showDrawer">
      <div class="drawer__overlay" @click="closeDrawer"></div>
      <form @submit.prevent="submitForm" class="drawer__taskForm">
        <label class="drawer__fieldLabel">
          Title:
          <input type="text" :value="card.title" class="drawer__titleInput" ref="titleRef" :disabled="!columns.length && !drawerForCreatingColumn"/>
        </label>
        <label class="drawer__fieldLabel" v-if="!drawerForCreatingColumn">
          Description:
          <textarea
            :value="card.text"
            rows="7"
            class="drawer__descriptionInput"
            ref="textRef"
            :disabled="!columns.length"
          />
        </label>
        <img :src="card.imgURL" :alt="card.title" class="drawer__img" ref="imgRef">
        <label class="drawer__fieldLabel" v-if="!drawerForCreatingColumn">
          Column:
          <select ref="selectRef" :value="card.parentColumn" :disabled="!columns.length">
            <option v-for="column in columns" :key="column">{{column}}</option>
          </select>
        </label>
        <p class="drawer__error" v-if="!columns.length && !drawerForCreatingColumn">There are no columns yet</p>
        <button class="drawer__btnSubmit" v-if="!drawerForCreatingColumn" @click.prevent="togglePopup" :disabled="!columns.length">Select image</button>
        <input type="submit" value="submit" class="drawer__btnSubmit" :disabled="!columns.length && !drawerForCreatingColumn"/>
      </form>
      <font-awesome-icon icon="times" size="2x" @click="closeDrawer" class="drawer__closeIcon" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Ref } from 'vue-property-decorator'
import { uuid } from 'uuidv4'
import { CardInterface } from '../interfaces/Card'
import Popup from './ImagesPopup.vue'

@Component({ components: { Popup } })
export default class Drawer extends Vue {
  @Prop({ default: false }) private showDrawer?: boolean;
  @Prop({ default: false }) private drawerForCreatingColumn?: boolean;
  @Prop() private card!: CardInterface

  @Ref() readonly titleRef!: HTMLInputElement;
  @Ref() readonly textRef!: HTMLTextAreaElement;
  @Ref() readonly selectRef!: HTMLSelectElement;
  @Ref() readonly imgRef!: HTMLImageElement;

  showPopup = false

  get columns () {
    return this.$store.state.columns
  }

  togglePopup () {
    this.showPopup ? this.showPopup = false : this.showPopup = true
  }

  submitForm () {
    if (!this.card.id && !this.drawerForCreatingColumn) {
      if (this.titleRef.value && this.textRef.value && this.imgRef.src && this.selectRef.value) {
        const card = {
          id: uuid(),
          title: this.titleRef.value,
          text: this.textRef.value,
          imgURL: this.imgRef.src, // when url is not provided show nothing
          parentColumn: this.selectRef.value
        }
        this.$store.dispatch('addNewCard', card)
      } else {
        this.$store.commit('showError', 'One or more fields were not filled')
      }
    } else if (this.drawerForCreatingColumn) {
      if (this.titleRef.value) {
        this.$store.dispatch('createColumn', {
          title: this.titleRef.value
        })
      } else {
        this.$store.commit('showError', 'Provide column title')
      }
    } else {
      if (this.titleRef.value && this.textRef.value && this.imgRef.src && this.selectRef.value) {
        const card = {
          id: this.card.id,
          title: this.titleRef.value,
          text: this.textRef.value,
          imgURL: this.imgRef.src, // when url is not provided show nothing
          parentColumn: this.selectRef.value
        }
        this.$store.dispatch('updateExistingCard', { card, futureIndex: null })
      } else {
        this.$store.commit('showError', 'One or more fields were not filled')
      }
    }
    this.closeDrawer()
  }

  openDrawer () {
    this.$emit('openDrawer', false)
  }

  closeDrawer () {
    this.$emit('closeDrawer')
  }

  saveImage (img: string) {
    this.imgRef.src = img
    this.showPopup = false
  }
}
</script>

<style lang="scss" scoped>
$drawer-width: 200px;
$content-blur: 2px;
$content-opacity: 0.2;
$speed: 0.1s;
$default-spacing: 30px;

.drawer {
  transition: all $speed ease-in-out;
  display: block;
  z-index: 1000;
  background: white;
  color: #fff;
  width: $drawer-width;
  position: fixed;
  top: 0;
  left: -$drawer-width;
  bottom: 0;
  box-shadow: rgba(0, 0, 0, 0.3) 2px 0 4px;
  left: 0;

  &__overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 500;
    background: rgba(0, 0, 0, 0.2);
  }

  &__taskForm {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0;
    padding: 30px 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1000;
  }

  &__fieldLabel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: black;
    text-align: left;
  }

  &__titleInput {
    width: 95%;
  }

  &__descriptionInput {
    resize: none;
    width: 95%;
  }

  &__img {
    width: 50%;
  }

  &__error {
    color: red
  }

  &__btnSubmit {
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px 30px;
  }

  &__closeIcon {
    color: black;
    position: absolute;
    bottom: 0;
    left: calc(50% - 11px);
    z-index: 1000;
  }
}

.btnOpenDrawer {
  transition: all $speed ease-in-out;
  position: absolute;
  right: 20px;
  border: none;
  display: block;
  background: inherit;
  bottom: 10px;
  padding: 0;
  margin: 0;
  outline: none;
}
</style>

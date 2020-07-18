<template>
  <div>
    <AlertModal v-if="alert">{{this.alert}}</AlertModal>
    <RemovalModal
          v-if="showRemovalModal"
          @toggleModal="toggleRemovalModal"
          @removeCard="removeCard"
          :id="itemIDToRemove"
        />
    <ul class="cardsWrapper">
      <li class="card" v-for="card in cards" :key="card.id">
        <div class="card__header">
          <font-awesome-icon
            icon="pen"
            size="2x"
            @click="editCard({ id: card.id, title: card.title, text: card.text })"
            class="card__penIcon"
          />
          <font-awesome-icon icon="trash" size="2x" @click="toggleRemovalModal(card.id)" />
        </div>
        <div class="card__content">
          <h1 class="card__title">{{card.title}}</h1>
          <p class="card__description">{{card.text}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CardInterface } from '../interfaces/Card'
import AlertModal from './AlertModal.vue'
import RemovalModal from './RemovalModal.vue'

@Component({ components: { AlertModal, RemovalModal } })
export default class Cards extends Vue {
  showRemovalModal = false;
  itemIDToRemove = ''

  get alert () {
    return this.$store.state.alert
  }

  get cards () {
    return this.$store.state.cards
  }

  created () {
    this.$store.dispatch('fetchAllCards')
  }

  toggleRemovalModal (id: string) {
    this.showRemovalModal = !this.showRemovalModal
    this.showRemovalModal ? this.itemIDToRemove = id : this.itemIDToRemove = ''
  }

  removeCard (id: string) {
    this.$store.dispatch('removeCard', id)
  }

  editCard (card: CardInterface) {
    this.$emit('openEditingDrawer', card)
  }
}
</script>

<style lang="scss" scoped>
.cardsWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  margin: auto;
  padding: 0;
  width: 90%;
}

.card {
  border: 1px solid black;
  padding: 10px;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
  min-width: 200px;
  width: 30%;

  @media screen and (max-width: 767px) {
    width: 46%;
  }

  @media screen and (max-width: 555px) {
    width: 100%;
  }

  &__header {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    text-align: right;
  }

  &__penIcon {
    margin-right: 10px;
  }

  &__title,
  &__description {
    text-align: left;
    word-break: break-all;
  }
}
</style>

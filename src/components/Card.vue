<template>
  <li class="cardWrapper">
    <RemovalModal
          v-if="showRemovalModal"
          @toggleModal="toggleRemovalModal"
          @removeCard="removeCard"
          :id="itemIDToRemove"
        />
      <div class="card">
        <div class="card__header">
          <font-awesome-icon
            icon="pen"
            size="2x"
            @click="editCard({ id: card.id, title: card.title, text: card.text, imgURL: card.imgURL, parentColumn: card.parentColumn })"
            class="card__penIcon"
          />
          <font-awesome-icon icon="trash" size="2x" @click="toggleRemovalModal(card.id)" />
        </div>
        <div class="card__content">
          <img class="card__img" :src="card.imgURL" :alt="card.title">
          <h1 class="card__title">{{card.title}}</h1>
          <p class="card__description">{{card.text}}</p>
        </div>
      </div>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { CardInterface } from '../interfaces/Card'
import RemovalModal from './RemovalModal.vue'

@Component({ components: { RemovalModal } })
export default class Cards extends Vue {
  @Prop() private card?: CardInterface
  showRemovalModal = false;
  itemIDToRemove = ''

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
@import "../mixins/mixins.scss";

.cardWrapper {
    background-color: #d0c0ff;
    border-radius: 10px;
    margin-bottom: 30px;
    padding: 10px;
}

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
  box-sizing: border-box;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 65%;

  @include respond-to(tablet) {
    width: 80%;
  }

  @include respond-to(smallScreen) {
    width: 100%;
  }

  &__header {
    border-bottom: 1px solid black;
    padding: 10px;
    text-align: right;
  }

  &__penIcon {
    margin-right: 10px;
  }

  &__content {
    padding: 10px;
  }

  &__img {
    max-width: 223px;
    height: auto;
    width: 60%;
  }

  &__title,
  &__description {
    font-size: 15px;
    text-align: left;
    word-break: break-all;
  }
}
</style>

<template>
  <div class="cardColumnWrapper">
    <h1 class="cardColumnTitle">{{ columnTitle }}</h1>
    <ul class="cardColumn">
      <draggable v-model="localCards" :move="move" group="{name: 'cards', pull: true, put: true}" animation=100>
        <Card :card="card" v-for="card in localCards" :key="card.id" @openEditingDrawer="openEditingDrawer"/>
      </draggable>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import { CardInterface } from '../interfaces/Card'
import Card from './Card.vue'

@Component({ components: { draggable, Card } })
export default class CardList extends Vue {
    @Prop() private columnTitle!: string;

    localCards: Array<CardInterface> = []

    get cards () {
      return this.$store.state.cards.filter((el: CardInterface) => el.parentColumn === this.columnTitle)
    }

    created () {
      this.localCards.push(...this.cards)
    }

    move (e: any) {
      const card = e.draggedContext.element
      const id = card.id
      const title = card.title
      const text = card.text
      const imgURL = card.imgURL
      const parentColumn = e.relatedContext.component.$parent.$el.children[0].innerText
      this.$store.dispatch('updateExistingCard', { id, title, text, imgURL, parentColumn })
      // const movedElementIndex = this.localCards.findIndex((el) => el.id === id) when updateExisting
      // this.localCards.splice(movedElementIndex, 1, { id, title, text, imgURL, parentColumn })
    }

    openEditingDrawer (card: CardInterface) {
      this.$emit('openEditingDrawer', card)
    }
}
</script>

<style lang="scss" scoped>
@import "../mixins/mixins.scss";

.cardColumnWrapper {
    border: 1px solid black;
    display: inline-block;
    min-width: 150px;
    padding: 15px;
    width: 25%;

    @include respond-to(tablet) {
      width: 45%;
    }

    @include respond-to(smallScreen) {
      width: 100%;
    }
}

.cardColumn {
    padding: 0;
    list-style-type: none;
}
</style>

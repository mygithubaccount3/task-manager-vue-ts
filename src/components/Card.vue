<template>
    <div class="card">
        <div class="card__header">
            <font-awesome-icon icon="pen" size="2x" @click="editCard" :style="{marginRight: '10px'}"/>
            <font-awesome-icon icon="trash" size="2x" @click="deleteCard"/>
        </div>
        <div class="card__content">
            <h1 class="card__title">{{this.title}}</h1>
            <p class="card__description">{{this.text}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Card extends Vue {
  @Prop(String) private id!: string;
  @Prop(String) private title!: string;
  @Prop(String) private text!: string;

  deleteCard () {
    if (confirm('Delete an item?')) {
      this.$emit('removeCard', this.id)
    }
  }

  editCard () {
    this.$emit('openEditingDrawer', this.id, this.title, this.text)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card {
    border: 1px solid black;
    padding: 10px;

    &__header {
        border-bottom: 1px solid black;
        padding-bottom: 10px;
        text-align: right;
    }

    &__title, &__description {
        text-align: left;
        word-break: break-all;
    }
}
</style>

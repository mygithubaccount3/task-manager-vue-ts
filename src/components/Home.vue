<template>
  <div :style="{minHeight: '150px', position: 'relative'}">
    <div class="overlay" @click="closeDrawer"></div>
    <button class="btn-toggle" name="addTask" @click="openDrawer">
      <font-awesome-icon icon="plus-circle" size="3x" />
    </button>
    <!-- <Drawer /> -->
    <div class="drawer">
      <form @submit.prevent="submitForm">
        <label>
          Title:
          <input type="text" name="titleInput" v-model="titleInput" />
        </label>
        <label>
          Description:
          <textarea rows="10" name="descriptionInput" v-model="descriptionInput" />
        </label>
        <input type="submit" value="submit" v-if="creating" />
        <input type="submit" value="submit" v-else />
      </form>
      <font-awesome-icon
        icon="times"
        size="2x"
        @click="closeDrawer"
        :style="{color: 'black', position: 'absolute', bottom: '0px', left: 'calc(50% - 11px)'}"
      />
    </div>
    <header>
      <span>&lt;{{this.email}}&gt;</span>
      <router-link to="/login" @click.native="logout()" replace class="logoutButton">LogOut</router-link>
    </header>
    <ul>
      <li v-for="card in cards" :key="card.id">
        <Card
          :id="card.id"
          :title="card.title"
          :text="card.text"
          @removeCard="removeCard"
          @openEditingDrawer="openEditingDrawer"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue } from 'vue-property-decorator'
import { uuid } from 'vue-uuid'
import Card from './Card.vue'

@Component({ name: 'Home', components: { Card } })
export default class Home extends Vue {
  email = localStorage.getItem('email');
  descriptionInput = '';
  titleInput = '';
  creating = true;
  id = '';

  get cards () {
    return this.$store.state.cards
  }

  created () {
    if (!this.email) {
      this.$router.replace('login')
    } else {
      this.$store.dispatch('fetchAllCards')
    }
  }

  openDrawer () {
    const root = document.getElementById('app')
    if (root) root.classList.add('drawer-open')
  }

  openEditingDrawer (id: string, title: string, text: string) {
    this.id = id
    this.titleInput = title
    this.descriptionInput = text
    this.creating = false
    this.openDrawer()
  }

  closeDrawer () {
    const root = document.getElementById('app')
    if (root) root.classList.remove('drawer-open')
    this.id = ''
    this.titleInput = ''
    this.descriptionInput = ''
    this.creating = true
  }

  logout () {
    this.$emit('logout')
  }

  submitForm () {
    if (this.creating) {
      this.$store.dispatch('addNewCard', { id: uuid.v4(), title: this.titleInput, text: this.descriptionInput })
    } else {
      this.$store.dispatch('updateExistingCard', { updatedCard: { id: uuid.v4(), title: this.titleInput, text: this.descriptionInput }, targetId: this.id })
    }
    this.closeDrawer()
  }

  removeCard (id: string) {
    // place to Card.vue
    this.$store.dispatch('removeCard', id)
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

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0;
    padding: 30px 9px;
    position: absolute;
    top: 0;
    bottom: 0;

    label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: black;
      text-align: left;

      input {
        width: 95%;
      }

      textarea {
        resize: none;
        width: 95%;
      }
    }

    input[type="submit"] {
      border: 1px solid black;
      border-radius: 5px;
      padding: 5px 30px;
    }
  }
}

.drawer-open {
  .drawer {
    box-shadow: rgba(0, 0, 0, 0.3) 2px 0 4px;
    left: 0;
  }
}

.drawer-open .overlay {
  display: block;
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 500;
  background: rgba(0, 0, 0, 0.2);
}

.btn-toggle {
  transition: all $speed ease-in-out;
  position: absolute;
  right: 20px;
  border: none;
  display: block;
  background: inherit;
  bottom: 20px;
  padding: 0;
  margin: 0;
  //width:50px;
  outline: none;
}

.drawer-open .drawer .btn-toggle {
  right: 20px;
  background: #fff;
  color: #000;
  &:before {
    content: "\f00d";
  }
  &:after {
    content: "Close";
  }
}
header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  padding-top: 10px;
  padding-bottom: 10px;

  & span {
    margin-left: 10px;
  }
}

.logoutButton {
  border: 1px solid #000000;
  border-radius: 5px;
  margin-right: 10px;
  padding: 5px 30px;
  text-decoration: none;
}

ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  margin: auto;
  padding: 0;
  width: 90%;

  & > li {
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
  }
}
</style>

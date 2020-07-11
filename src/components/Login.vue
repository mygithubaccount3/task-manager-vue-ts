<template>
  <div class="formWrapper">
    <h1>Login Page</h1>
    <form @submit.prevent="logIn" class="loginForm">
      <label for="emailInput">email:</label>
      <input type="email" v-model="email" id="emailInput" />
      <p class="error" v-if="error.length">{{this.error}}</p>
      <button type="submit">submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
@Component
export default class Login extends Vue {
  email = '';
  error = '';

  logIn () {
    if (this.email !== '') {
      if (
        /^(?=.{1,60}$)[a-zA-Z]+([.+]?[a-zA-Z0-9]+)*@[a-zA-Z]+\.[a-zA-Z]+$/.test(
          this.email
        )
      ) {
        localStorage.setItem('email', this.email)
        this.$emit('authenticated', true)
        this.$router.replace({ name: 'Home', params: { email: this.email } })
      } else {
        this.error = 'Email is invalid'
      }
    } else {
      this.error = 'User not found'
    }
  }
}
</script>

<style lang='scss' scoped>
.formWrapper {
  border: 1px solid black;
  margin: auto;
  min-width: 200px;
  padding: 10px;
  width: 25%;
}

.loginForm {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: auto;
  height: 150px;

  & label {
    align-self: flex-start;
    margin-bottom: 10px;
  }

  & input {
    width: 100%;
  }

  & > button {
    background-color: white;
    border: 1px solid black;
    border-radius: 5px;
    margin: auto;
    padding: 7px;
    width: 30%;
  }
}

.error {
  align-self: flex-start;
  background-color: red;
  color: white;
  padding: 3px;
  width: 172px;
}
</style>

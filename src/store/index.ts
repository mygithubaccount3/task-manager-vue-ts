import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface CardInterface {
  id: string;
  title: string;
  text: string;
}

export default new Vuex.Store({
  state: {
    cards: Array<CardInterface>()
  },
  mutations: {
    clear (state) {
      state.cards.splice(0)
    },
    saveCardsFromLocalStorage (state, payload) {
      payload.cards.forEach((el: CardInterface) => state.cards.push(el))
    },
    addNewCard (state, payload) {
      state.cards.push(payload)
    },
    updateExistingCard (state, payload) {
      const elIndex = state.cards.findIndex((el: CardInterface) => el.id === payload.targetId)
      state.cards.splice(elIndex, 1, payload.updatedCard)
    },
    removeCard (state, payload) {
      const index = state.cards.findIndex((el: CardInterface) => el.id === payload)
      state.cards.splice(index, 1)
    }
  },
  actions: {
    fetchAllCards (context) {
      const remoteCards = localStorage.getItem('card-items')
      const parsedRemoteCards =
        remoteCards === null ? null : JSON.parse(remoteCards)
      context.commit('clear')
      if (parsedRemoteCards) {
        context.commit('saveCardsFromLocalStorage', parsedRemoteCards)
      }
    },
    addNewCard (context, payload) {
      context.commit('addNewCard', payload)
      localStorage.setItem('card-items', JSON.stringify(context.state))
    },
    updateExistingCard (context, payload) {
      context.commit('updateExistingCard', payload)
      localStorage.setItem('card-items', JSON.stringify(context.state))
    },
    removeCard (context, payload) {
      context.commit('removeCard', payload)
      localStorage.setItem('card-items', JSON.stringify(context.state))
    }
  },
  modules: {
  }
})

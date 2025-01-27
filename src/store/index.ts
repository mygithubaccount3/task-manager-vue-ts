import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import { CardInterface } from '../interfaces/Card'

Vue.use(Vuex)

function getCards (destination: string, context: ActionContext<{ cards: CardInterface[]; alert: string }, {
  cards: CardInterface[];
  alert: string;
}>) {
  switch (destination) {
    case 'localStorage':
      if (localStorage) {
        try {
          return localStorage.getItem('card-items')
        } catch (e) {
          context.commit('showError', `Error occured: ${e.message}`)
          return '[]'
        }
      } else {
        context.commit('showError', 'Your browser does not support localStorage')
        return '[]'
      }
    default:
      context.commit('showError', 'Error getting cards')
      return '[]'
  }
}

function saveCards (destination: string, cards: CardInterface[], context: ActionContext<{ cards: CardInterface[]; alert: string }, {
  cards: CardInterface[];
  alert: string;
}>) {
  switch (destination) {
    case 'localStorage':
      if (localStorage) {
        try {
          localStorage.setItem('card-items', JSON.stringify(cards))
        } catch (e) {
          context.commit('showError', `Error occured: ${e.message}`)
        }
      } else {
        context.commit('showError', 'Error occured: Your browser does not support localStorage. This app will not work')
      }
      break
    default:
      context.commit('showError', 'Error occured: cards are not saved')
  }
}

export default new Vuex.Store({
  state: {
    cards: Array<CardInterface>(),
    alert: '',
    columns: Array<string>()
  },
  mutations: {
    clear (state) {
      state.cards.splice(0)
    },
    saveCardsFromLocalStorage (state, payload) {
      payload.forEach((el: CardInterface) => state.cards.push(el))
    },
    addNewCard (state, payload) {
      state.cards.push(payload)
    },
    updateExistingCard (state, payload) {
      const elIndex = state.cards.findIndex((el: CardInterface) => el.id === payload.card.id)
      if (payload.futureIndex !== null) {
        state.cards.splice(elIndex, 1)
        state.cards.splice(payload.futureIndex, 0, payload.card)
      } else {
        state.cards.splice(elIndex, 1, payload.card)
      }
    },
    removeCard (state, payload) {
      const index = state.cards.findIndex((el: CardInterface) => el.id === payload)
      state.cards.splice(index, 1)
    },
    showError (state, payload) {
      state.alert = payload
    },
    createColumn (state, payload) {
      state.columns.push(payload.title)
    },
    pushColumn (state, payload) {
      state.columns.splice(0, state.columns.length, ...payload)
    }
  },
  actions: {
    fetchAllCards (context) {
      const remoteCards = getCards('localStorage', context)
      const parsedRemoteCards =
        remoteCards === null ? null : JSON.parse(remoteCards)
      context.commit('clear')
      if (parsedRemoteCards) {
        context.commit('saveCardsFromLocalStorage', parsedRemoteCards)
      }
      const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')!) : null
      if (columns) {
        context.commit('pushColumn', columns)
      }
    },
    addNewCard (context, payload) {
      context.commit('addNewCard', payload)
      saveCards('localStorage', context.state.cards, context)
    },
    updateExistingCard (context, payload) {
      context.commit('updateExistingCard', payload)
      saveCards('localStorage', context.state.cards, context)
    },
    removeCard (context, payload) {
      context.commit('removeCard', payload)
      saveCards('localStorage', context.state.cards, context)
    },
    createColumn (context, payload) {
      context.commit('createColumn', payload)
      localStorage.setItem('columns', JSON.stringify(context.state.columns))
    }
  },
  modules: {
  }
})

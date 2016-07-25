import {} from '../mutation-types'

const state = {
  list: [],
  exchangeList: [],
  returnsList: []
}

const mutations = {
  ADD_BARCODE (state, payload) {
    state.list.push(payload)
  },
  REMOVE_BARCODE (state, payload) {
    state.list.$remove(payload)
  },
  UPDATE_NOTE (state, payload) {
    state.list[payload.index].notes = payload.note
  },
  SET_EXCHANGES_LIST (state, payload) {
    state.exchangeList = payload
  },
  SET_RETURNS_LIST (state, payload) {
    state.returnsList = payload
  },
  TOGGLE_IS_FOUND (state, index) {
    state.exchangeList[index].isFound = true
  }
}

export default {
  state,
  mutations
}

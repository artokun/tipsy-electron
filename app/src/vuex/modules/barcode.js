import {} from '../mutation-types'

const state = {
  list: []
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
  }
}

export default {
  state,
  mutations
}

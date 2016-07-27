import {} from '../mutation-types'

const state = {
  list: [],
  exchangeList: [],
  returnsList: [],
  rawReturns: []
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
  UPDATE_COMMENT (state, payload) {
    state.rawReturns[payload.index].COMMENTS = payload.note
  },
  SET_EXCHANGES_LIST (state, payload) {
    state.exchangeList = payload
  },
  SET_RAW_RETURNS_LIST (state, payload) {
    state.rawReturns = payload
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

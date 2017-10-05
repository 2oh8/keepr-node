import axios from 'axios'
import vue from 'vue'
import vuex from 'vuex'

let api = axios.create({
  baseURL: '//jellikeepr.herokuapp.com/api/',
  timeout: 200000,
  withCredentials: true
})

let auth = axios.create({
  baseURL: '//jellikeepr.herokuapp.com/',
  timeout: 200000,
  withCredentials: true
})
vue.use(vuex)

var store = new vuex.Store({
  state: {
    user: {},
    vaults: [],
    keeps: [],
    allKeeps: [],
    activeVault: {},
    error: {},
    registered: false,
    loggedIn: null
  },
  mutations: {
    setVaults(state, data) {
      state.vaults = data
    },
    setRegistered(state, data) {
      state.registered = true
    },
    setLoggedIn(state, value) {
      state.loggedIn = value;
    },
    setUser(state, user) {
      state.user = user;
    },
    handleError(state, err) {
      state.error = err
    },
    setActiveVault(state, vault) {
      state.activeVault = vault;
    },
    setKeeps(state, keeps) {
      state.keeps = keeps;
    },
    setAllKeeps(state, data){
      state.allKeeps = data
    },
    setKeepTasks(state, data) {
      vue.set(state.tasks, data.keepId, data.data) // use this any time you are adding a property to an object on the fly (that you care about)
      // state.tasks[data[0].keepId] = data
      // console.log(state.tasks)
    },
    setTaskComments(state, data) {
      vue.set(state.comments, data.taskId, data.data)
    }
  },
  actions: {
    //when writing your auth routes (login, logout, register) be sure to use auth instead of api for the posts

    registerUser({ commit, dispatch }, newUser) {
      auth.post('/register', newUser)
        .then(res => {
          commit('setRegistered')
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    login({ commit, dispatch }, credentials) {
      auth.post('/login', credentials)
        .then(res => {
          commit('setLoggedIn', true)
          commit('setUser', res.data.data)
        }).catch(err => {
          commit('handleError', err)
          commit('setLoggedIn', false)
        })
    },

    logout({ commit, dispatch }, credentials) {
      auth.delete('/logout')
        .then(res => {
          console.log(res.message)
          commit('setLoggedIn', false)
        }).catch(err => {
          commit('handleError', err)
        })
    },

    authenticate({ commit, dispatch }) {
      auth('/authenticate')
        .then(res => {
          if (res.data.data._id) {
            console.log('Ready to commit!')
            commit('setLoggedIn', true)
            commit('setUser', res.data.data)
            commit('setUser', res.data.data)
          } else {
            commit('setLoggedIn', false)
            console.log('No session found!')
          }
        }).catch(err => {
          commit('handleError', err)
          commit('setLoggedIn', false)
        })
    },

    getVaults({ commit, dispatch }) {
      api('uservaults')
        .then(res => {
          console.log(res.data.data)
          commit('setVaults', res.data.data)

        })
        .catch(err => {
          commit('handleError', err)
        })
    },
    getVault({ commit, dispatch }, id) {
      api('vaults/' + id)
        .then(res => {
          console.log("setting active vault")
          commit('setActiveVault', res.data.data)
        })
        .catch(err => {
          commit('handleError', err)
        })
    },
    createVault({ commit, dispatch }, vault) {
      api.post('vaults/', vault)
        .then(res => {
          dispatch('getVaults')
        })
        .catch(err => {
          commit('handleError', err)
        })
    },
    removeVault({ commit, dispatch }, id) {
      api.delete('vaults/' + id)
        .then(res => {
          dispatch('getVaults')
        })
        .catch(err => {
          commit('handleError', err)
        })
    },
    // Keep Stuff:
    getKeeps({ commit, dispatch }, id) {
      api('vaults/' + id + '/keeps') // created this in custom-routes/vault-routes.js under vaultKeeps
        .then(res => {
          // console.log(res)
          commit('setKeeps', res.data.data)
          // keep.keepId = keep._id
          // dispatch('getKeepTasks', keep)
        })
        .catch(err => {
          commit('handleError', err)
        })

    },
    getAllKeeps({ commit, dispatch }, id) {
      api('/keeps') // created this in custom-routes/vault-routes.js under vaultKeeps
        .then(res => {
          // console.log(res)
          commit('setAllKeeps', res.data.data)
          // keep.keepId = keep._id
          // dispatch('getKeepTasks', keep)
        })
        .catch(err => {
          commit('handleError', err)
        })

    },
    addKeep({ commit, dispatch }, keep) {
      console.log(keep)
      api.post('vaults/' + keep.vaultId + '/keeps/', keep)
        .then(res => {
          console.log("came back with response after adding Keep")
          dispatch('getKeeps', keep.vaultId)
        }).catch(err => {
          console.log('failed to add keep')
          commit('handleError', err)
        })
    },
    updateKeep({ commit, dispatch }, { keep, vaultId }) {
      api.put('/keeps/' + keep._id, keep)
        .then(res => {
          dispatch('getKeeps', vaultId)
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    handleError({ commit, dispatch }, err) {
      commit('handleError', err)
    }
  }

})


export default store

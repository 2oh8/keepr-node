import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Vault from '@/components/Vault'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vaults/:vaultId',
      name: 'Vault',
      component: Vault
    }
  ]
})

<template>
  <div class="home mt-2">


    <v-flex xs12 v-if="!loggedIn">
      <v-card class="elevation-24">
        <v-card-title>
          <h3 v-if="!registerToggle" class="headline mb-0 montserrat-thick">Sign In</h3>
          <h3 v-if="registerToggle" class="headline mb-0 montserrat-thick">Register</h3>
          <v-switch v-model="registerToggle" color="pink darken-2" class="ml-5 montserrat-thick"></v-switch>
        </v-card-title>
        <v-text-field v-if="registerToggle" label="Username" v-model="name" class="montserrat-thick"></v-text-field>
        <v-text-field label="E-mail" v-model="email" class="montserrat-thick"></v-text-field>
        <v-text-field label="Password" v-model="password" class="montserrat-thick"></v-text-field>
        <v-btn v-if="!registerToggle" flat class="orange--text montserrat-thick" @click="logIn()">Sign-In</v-btn>
        <v-btn v-if="registerToggle" flat class="orange--text montserrat-thick" @click="registerUser()">Register</v-btn>
      </v-card>
    </v-flex>

  </div>
</template>

<script>
  import Vaults from '@/components/Vaults'

  export default {
    name: 'home',
    data() {
      return {
        registerToggle: false,
        name: '',
        email: '',
        password: '',
      }
    },
    components: {
      Vaults
    },
    mounted() {

    },
    computed: {
      loggedIn() {
        return this.$store.state.loggedIn
      }
    },
    methods: {
      logIn() {
        var credentials = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch("login", credentials)
      },
      registerUser() {
        var newUser = {
          name: this.name,
          email: this.email,
          password: this.password
        }
        this.$store.dispatch("registerUser", newUser)
      },
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .montserrat-thick {
    font-family: 'Montserrat', sans-serif;
    font-style: 900;
  }
</style>
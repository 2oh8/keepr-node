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
        <v-text-field label="Password" type="password" v-model="password" class="montserrat-thick"></v-text-field>
        <v-btn v-if="!registerToggle" flat class="orange--text montserrat-thick" @click="logIn()">Sign-In</v-btn>
        <v-btn v-if="registerToggle" flat class="orange--text montserrat-thick" @click="registerUser()">Register</v-btn>
      </v-card>
    </v-flex>

    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm4 v-for="keep in keeps">
          <v-card class="elevation-24">
            <v-card-media :src="keep.img" height="175px">
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline white--text montserrat-thick" v-text="keep.name"></span>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions class="transparent">
                <v-btn icon @click.stop="prepareToAddKeep(keep)">
                  <v-icon>favorite</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-media>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline montserrat-thick">Add Keep to Which Vault?</v-card-title>
        <v-card-actions v-for="vault in vaults">
          <v-btn block class="blue--text darken-2 montserrat-thick" flat="flat" @click.native="addToVault(vault._id)">{{ vault.name }}</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="orange--text darken-1 montserrat-thick" flat="flat" @click.native="cancelAdd()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        readyToAdd: {},
        dialog: false
      }
    },
    components: {
      Vaults
    },
    mounted() {
      this.$store.dispatch('getAllKeeps')
    },
    computed: {
      loggedIn() {
        return this.$store.state.loggedIn
      },
      keeps() {
        return this.$store.state.allKeeps
      },
      vaults() {
        return this.$store.state.vaults
      },
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
      prepareToAddKeep(keep) {
        this.readyToAdd = keep
        this.dialog = true
      },
      cancelAdd() {
        this.dialog = false
        this.readyToAdd = ''
      },
      addToVault(input) {
        var updatedKeep = this.readyToAdd
        updatedKeep.vaultId.push(input)
        this.$store.dispatch('updateKeep', { keep: updatedKeep, vaultId: input })
        this.dialog = false
      }
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
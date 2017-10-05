<template>
    <div class="vault mt-2">
        <v-layout row>
            <h3 class="montserrat-thick">{{ activeVault.name }}</h3>
        </v-layout>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex v-for="keep in keeps">
                    <v-card>
                        <v-card-media height="150px">
                            <v-container fill-height fluid>
                                <v-layout fill-height>
                                    <v-flex xs12 align-end flexbox>
                                        <span class="headline white--text" v-text="keep.name"></span>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-media>
                        <v-card-actions class="grey darken-1">
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>favorite</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>bookmark</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>share</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm3>
                    <v-card class="elevation-24">
                        <v-card-media height="150px">
                            <v-container fill-height fluid>
                                <v-flex xs10>
                                    <v-text-field label="title" v-model="keepTitle"></v-text-field>
                                    <v-text-field label="description" v-model="keepDescription"></v-text-field>
                                </v-flex>
                            </v-container>
                        </v-card-media>
                        <v-card-actions class="grey darken-1">
                            <v-spacer></v-spacer>
                            <v-btn class="pink darken-2 montserrat-thick" @click.prevent="addKeep()">
                                <v-icon>favorite</v-icon>ADD NEW KEEP
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'vault',
        data() {
            return {
                keepTitle: '',
                keepDescription: '',
            }
        },
        components: {

        },
        mounted() {
            this.$store.dispatch('getVault', this.$route.params.vaultId)
            this.$store.dispatch('getKeeps', this.$route.params.vaultId)
        },
        computed: {
            activeVault() {
                return this.$store.state.activeVault
            },
            keeps() {
                return this.$store.state.keeps
            }
        },
        methods: {
            addKeep() {
                // console.log(this.activeBoard._id)
                var newKeep = {
                    name: this.keepTitle,
                    description: this.keepDescription,
                    vaultId: this.$route.params.vaultId
                }
                this.$store.dispatch("addKeep", newKeep)
                this.keepTitle = ''
                this.keepDescription = ''
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
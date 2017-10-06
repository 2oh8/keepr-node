<template>
    <div class="vault mt-2">
        <v-layout row>
            <h2 class="montserrat-thick mega-headline">{{ activeVault.name }}</h2>
        </v-layout>
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
                        </v-card-media>
                        <v-card-actions class="grey darken-1">
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>favorite</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>bookmark</v-icon>
                            </v-btn>
                            <v-btn icon @click.prevent="deleteKeep(keep)">
                                <v-icon>delete_forever</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm4>
                    <v-card class="elevation-24">
                        <v-card-media height="175px">
                            <v-container>

                                <v-layout row wrap>

                                    <v-flex xs4>
                                        <v-text-field label="title" v-model="keepTitle" class="montserrat-thick"></v-text-field>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-text-field label="desc." v-model="keepDescription" class="montserrat-thick"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field label="image url" v-model="keepImg" class="montserrat-thick"></v-text-field>
                                    </v-flex>
                                </v-layout>
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
                keepImg: ''
            }
        },
        mounted() {
            this.$store.dispatch('getKeeps', this.vaultId)
            this.$store.dispatch('getVault', this.$route.params.vaultId)
        },
        computed: {
            activeVault() {
                return this.$store.state.activeVault
            },
            keeps() {
                return this.$store.state.keeps
            },
            vaultId() {
                return this.$route.params.vaultId
            }
        },
        watch: {
            vaultId: {
                handler() {
                    this.$store.dispatch('getKeeps', this.vaultId)
                    this.$store.dispatch('getVault', this.$route.params.vaultId)
                }
            }
        },
        methods: {
            addKeep() {
                // console.log(this.activeBoard._id)
                var newKeep = {
                    name: this.keepTitle,
                    description: this.keepDescription,
                    img: this.keepImg,
                    vaultId: this.$route.params.vaultId
                }
                this.$store.dispatch("addKeep", newKeep)
                this.keepTitle = ''
                this.keepDescription = ''
                this.keepImg = ''
            },
            deleteKeep(input) {
                input.vaultId.splice(this.$route.params.vaultId, 1)
                this.$store.dispatch('updateKeep', { keep: input, vaultId: this.$route.params.vaultId })
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

    .mega-headline {
        opacity: .5
    }
</style>
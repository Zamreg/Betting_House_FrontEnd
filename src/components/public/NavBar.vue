<template>
    <nav>
        <v-navigation-drawer v-model="drawer" 
                             clipped 
                             class="grey lighten-4" 
                             app>
            
            <v-list dense class="grey lighten-4">
                <template v-for="(item, i) in itemsSideBar">
                    <v-layout v-if="item.heading" 
                              :key="i"
                              row
                              align-center>
                        <v-flex xs6>
                            <v-subheader>
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                    </v-layout>

                    <v-divider v-else-if="item.divider"
                               :key="i"
                               dark
                               class="my-3">
                    </v-divider>

                    <v-list-tile v-else-if="!item.becomeVIPAction"
                                 :key="i"
                                 :to="item.path">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile v-else-if="item.becomeVIPAction"
                                 :key="i"
                                 @click.stop="openVIPModal">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar dark
                   fixed
                   clipped-left
                   app
                   color="primary">
            
            <v-toolbar-side-icon @click.prevent="drawer = !drawer"></v-toolbar-side-icon>

            <!--v-img #quando quisermos por um logo
                src="https://cdn1.iconfinder.com/data/icons/dotted-charts/512/links_diagram-128.png"
                max-height="38px"
                max-width="38px"
                v-on:click="goTo('/')"
                :style="{ cursor: 'pointer'}"
            >
            </v-img-->

            <v-toolbar-title>
                <span>
                    <template v-for="(menu, i) in navBarTop">
                        <v-btn v-if="!menu.coins" @click="goTo(menu.path)" flat :key="i">
                            <v-icon dark left> {{menu.icon}} </v-icon>
                            {{menu.text}}
                        </v-btn>
                        <v-btn v-if="menu.coins" @click.stop="showCoinsModal = true" flat :key="i">
                            <v-icon dark left>fas fa-plus</v-icon>
                            <v-icon dark left>fas fa-coins</v-icon>
                            Coins: {{user.coins}}
                        </v-btn>
                    </template>
                </span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-icon dark left>mdi-account</v-icon>
                <!--<v-btn @click="goTo('/login')" flat>-->
                <!--Login-->
                <!--</v-btn>-->
                <!--<v-btn @click="goTo('/register')" flat>-->
                <!--Register-->
                <!--</v-btn>-->
                <v-btn @click="signOut()" flat>
                    Sign Out
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <CoinsModal :visible="showCoinsModal" @close="showCoinsModal = false" @updateCoins="updateCoins"/>
        <BecomeVIPModal :visible="showBecomeVIPModal" @close="showBecomeVIPModal = false" @becomeVIP="becomeVIP"/>
    </nav>
</template>

<script>
    import httpService from '../../api/http/http-service'

    import {Profile} from "../../api/domain/profile";
    import {environment} from "../../environment";
    import CoinsModal from "./CoinsModal";
    import BecomeVIPModal from "./BecomeVIPModal";

    export default {
        name: 'NavBar',
        components: {
            BecomeVIPModal,
            CoinsModal
        },
        data() {
            return {
                user: null,
                showCoinsModal: false,
                showBecomeVIPModal: false,
                itemsSideBar: [],
                navBarTop: [],
                drawer: false, // this.$vuetify.breakpoint.lgAndUp,
                adminNavBarTop: [
                    { text: 'Betting House', path: '/', icon: 'mdi-home' },
                    { text: 'Event', path: '/', icon: 'fas fa-calendar-plus' },
                    // { text: 'Sport', path: '/sport', icon: 'mdi-soccer' },
                    // { text: 'Team', path: '/sport', icon: 'fas fa-users' }
                ],
                VIPNavBarTop: [
                    { text: 'Betting House', path: '/', icon: 'mdi-home' },
                    { coins: true }
                ],
                regularNavBarTop: [
                    { text: 'Betting House', path: '/', icon: 'mdi-home' },
                    { coins: true }
                ],
                sports: null,
                items: [
                    // { heading: 'Sports'},
                    // { text: 'Futebol', path: '/football', icon: 'mdi-soccer' },
                    // { text: 'Basquetebol', path: '/basketball', icon: 'mdi-basketball' },
                    // { text: 'Formula 1', path: '/formula1', icon: 'mdi-speedometer' },
                ],
                adminItemsSideBar: [
                    { heading: 'My account' },
                    { text: 'Account', path: '/conta', icon: 'mdi-account' },
                    { text: 'Definitions', path: '/conta', icon: 'mdi-settings' },
                    { divider: true },
                    { heading: 'Operations' },
                    { text: 'Event', path: '/#', icon: 'fas fa-plus'},
                    { text: 'Sport', path: '/#', icon: 'fas fa-plus'},
                    { text: 'Team', path: '/#', icon: 'fas fa-plus'},
                    { divider: true }
                ],
                vipItemsSideBar: [
                    { heading: 'My account' },
                    { text: 'Account', path: '/conta', icon: 'mdi-account' },
                    { text: 'Definitions', path: '/conta', icon: 'mdi-settings' },
                    { divider: true }
                ],
                regularItemsSideBar: [
                    { heading: 'My account' },
                    { text: 'Account', path: '/conta', icon: 'mdi-account' },
                    { text: 'Definitions', path: '/conta', icon: 'mdi-settings' },
                    { text: 'Become VIP', becomeVIPAction: true, icon: 'fas fa-medal' },
                    { divider: true }
                ]
            }
        },
        mounted: function () {
            const user = JSON.parse(localStorage.getItem(environment.userSession));
            httpService.get('users/' + user._id)
                .then((response) => {
                    this.user = response;
                    this.setNavBarBasedOnUserProfile();
                    this.getAllSports();
                })
                .catch((error) => {
                    this.displayErrorMessage({title: 'User', message: error.message});
                });
        },
        methods:{
            goBack: function(){
                this.$router.go(-1)
            },
            goTo: function (path) {
                this.$router.push(path)
            },
            signOut: function () {
                localStorage.clear();
                this.$router.push('/login');
            },
            displayErrorMessage: function (error) {
                this.$toast.error({
                    title: error.title,
                    message: error.message
                })
            },
            updateCoins: function (coins) {
                this.user.coins = coins;
            },
            openVIPModal: function () {
                this.showBecomeVIPModal = true;
            },
            becomeVIP: function (user) {
                this.navBarTop = this.VIPNavBarTop;
                this.itemsSideBar = this.vipItemsSideBar;
                this.user = user;
            },
            setNavBarBasedOnUserProfile: function () {
                if (this.user.profile.name === Profile.ADMINISTRATOR) {
                    this.navBarTop = this.adminNavBarTop;
                    this.itemsSideBar = this.adminItemsSideBar;
                } else if (this.user.profile.name === Profile.VIP) {
                    this.navBarTop = this.VIPNavBarTop;
                    this.itemsSideBar = this.vipItemsSideBar;
                } else if (this.user.profile.name === Profile.REGULAR) {
                    this.navBarTop = this.regularNavBarTop;
                    this.itemsSideBar = this.regularItemsSideBar;
                }
            },
            getAllSports: function () {
                httpService.get('sports/all')
                    .then((response) => {
                        if (response) {
                            response.forEach((sport) => {
                                this.items.push({ text: sport.name, path: '/sport/' + sport.id, icon: 'mdi-soccer'});
                            });
                        }
                    })
                    .catch((error) => {
                        this.displayErrorMessage({title: 'Sport', error: error.message});
                    });
            }
        }
    }
</script>
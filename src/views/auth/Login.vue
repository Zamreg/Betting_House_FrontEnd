<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-card elevation-1>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field prepend-icon="person" v-model="login" name="login" label="Login" type="text"></v-text-field>
                            <v-text-field id="password" v-model="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="goTo('/register')" color="primary">Sign Up</v-btn>
                        <v-btn @click.prevent="signIn(login, password)" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import httpService from '../../api/http/http-service'
import {environment} from "../../environment";
import User from "../../api/domain/user";
import {Profile} from "../../api/domain/profile";

export default {
    data() {
        return {
            login: null,
            password: null,
            alertMessage: null
        }
    },
    methods: {
        signIn: async function(login, password){
            await httpService.post('login/', {login: login, password: password})
                .then((response) => {
                    localStorage.setItem(environment.userToken, response.token);
                    localStorage.setItem(environment.userSession, JSON.stringify(this.createUserSession(response)));
                    if (response.profile.name === Profile.ADMINISTRATOR) {
                        this.goTo('/admin');
                    } else {
                        this.goTo('/');
                    }
                }).catch((error) => {
                    this.displayErrorMessage('Login', error.message);
                });
        },
        createUserSession: function (response) {
            return new User(response.id, response.name, response.profile, response.login, response.email);
        },
        goTo: function (path) {
            this.$router.push(path)
        }
    }
}
</script>


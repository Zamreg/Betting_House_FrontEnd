import axios from 'axios';
import {HttpUtil} from "./http-util";
import {ApiError} from "../api-error";
import {environment} from "../../environment";
import {Profile} from "../domain/profile";

export default {

    async post(url, parameters) {
        return await axios.post(HttpUtil.url(url), parameters, HttpUtil.headers())
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error.response);
                if (!error.response) {
                    const errorModel = {status: 404, message: ApiError["FAILED_TO_CONNECT_TO_SERVER"]};
                    return this.executeOnResponseError(errorModel);
                } else if (!error.response.data){
                    const errorModel = {status: error.response.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                } else {
                    const errorModel = {status: error.response.data.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                }
            });
    },

    async get(url) {
        return await axios.get(HttpUtil.url(url), HttpUtil.headers())
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                if (!error.response) {
                    const errorModel = {status: 404, message: ApiError["FAILED_TO_CONNECT_TO_SERVER"]};
                    return this.executeOnResponseError(errorModel);
                } else if (!error.response.data){
                    const errorModel = {status: error.response.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                } else {
                    const errorModel = {status: error.response.data.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                }
            });
    },

    async delete(url) {
        return await axios.delete(HttpUtil.url(url), HttpUtil.headers())
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (!error.response) {
                    const errorModel = {status: 404, message: ApiError["FAILED_TO_CONNECT_TO_SERVER"]};
                    return this.executeOnResponseError(errorModel);
                } else if (!error.response.data){
                    const errorModel = {status: error.response.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                } else {
                    const errorModel = {status: error.response.data.status, message: ApiError[error.response.data.message]};
                    return this.executeOnResponseError(errorModel);
                }
            });
    },

    executeOnResponseError(error) {
        this.checkAutheticationValidity(error);
        if (error.status === 404) {
            error.message = ApiError["API_ENDPOINT_NOT_FOUND"];
        }
        return Promise.reject(error);
    },
    
    checkAutheticationValidity(error) {
        if (error.status === 401) {
            localStorage.clear();
            this.$router.push('/login');
        }
    },
    
    isUserLoggedIn() {
        return !(localStorage.getItem(environment.userToken) === null || localStorage.getItem(environment.userToken) === undefined);
    },
    
    isUserAdmin() {
        const user = JSON.parse(localStorage.getItem(environment.userSession));
        return user._profile.name === Profile.ADMINISTRATOR;
    }
}
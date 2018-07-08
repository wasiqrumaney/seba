"use strict";

import HttpService from "./HttpService";

/**
 *  VERY IMPORTANT: the user accesses through two routes, depending on if they are getting private/own information
 *  or public information. Auth is required for this private information, and the URL base of baseURL(/auth) is used
 *  for that. For other user functions, baseURLusers is used (/users)
 */
export default class UserService {

    constructor() {
    }
    static baseURL() {return "http://localhost:3000/auth"; }

    static baseURLusers() {return "http://localhost:3000/users"; }

    static baseURLutility() {return "http://localhost:3000/utility"; }


    static register(user, pass, first_name, last_name, seeker, host) {

        console.log("register.");

        return new Promise((resolve, reject) => {
            HttpService.post(`${UserService.baseURL()}/register`, {
                email: user,
                password: pass,
                name : {
                    first : first_name,
                    last : last_name
                },
                seeker: seeker,
                host: host
            }, function(data) {
                resolve(data);
            }, function(textStatus) {
                console.log("textStatus", textStatus);
                reject(textStatus);
            });
        });
    }

    static login(user, pass) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${UserService.baseURL()}/login`, {
                email: user,
                password: pass
            }, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static logout(){
        window.localStorage.removeItem('jwtToken');
    }

    static getCurrentUser() {
        let token = window.localStorage['jwtToken'];
        if (!token) return {};

        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');

        return {
            id : JSON.parse(window.atob(base64)).id,
            email: JSON.parse(window.atob(base64)).email,
        };
    }

    static me() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${UserService.baseURL()}/me`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }


    static public(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${UserService.baseURLusers()}/${id}`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static isAuthenticated() {
        return !!window.localStorage['jwtToken'];
    }


    static isHost(){
        return this.me().then(user => {
            return user.host === true
        });
    }
ss
    /**
     * Provide pending requests, ordered becency, for the logged in user.
     * @param user
     * @returns {Request}
     */
    static getPendingRequests(){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURLusers()}/requests/pending`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    /**
     * Provide currently active contracts, ordered by start time (ie. starting latest first), for logged in user
     * @param user
     * @returns {Contract}
     */
    static getActiveContracts(){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURLusers()}/contracts/active`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    /**
     *  Provide past contracts for a user, ordered by end time (ie. most recently ending appears at the top)
     * @returns {Contract}
     */
    static getPastContracts(){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURLusers()}/contracts/past`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }


    static becomeHostSeeker(){
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURLusers()}/becomeHostSeeker`, {}, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static incrementBalance(balance){
        return new Promise((resolve, reject) => {
            if (Number.isInteger(balance) && parseInt(balance) >= 0){
                return reject("Payment not executed correctly.");
            }

            console.log("incrementBalance balance:", balance);

            HttpService.put(`${this.baseURLutility()}/incrementBalance`, {balance:parseInt(balance)}, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }



}
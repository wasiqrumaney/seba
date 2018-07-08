"use strict";

import HttpService from './HttpService';
import UserService from "./UserService";

export default class ListingService {

    constructor(){
    }

    static baseURL() {return "http://localhost:3000/listings" }

    static getListings(){
       return new Promise((resolve, reject) => {
           HttpService.get(this.baseURL(), function(data) {
               resolve(data);
           }, function(textStatus) {
               reject(textStatus);
           });
       });
    }

    static getLastListings(){
        return new Promise((resolve, reject) => {
            HttpService.get(`${ListingService.baseURL()}/lastListings`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }
    static getListing(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${ListingService.baseURL()}/${id}`, function(data) {
                if(data != undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving Listing');
                }
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static getListingByUserId(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${UserService.baseURLusers()}/${id}/listings`, function(data) {
                if(data != undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving Listing');
                }
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static getListingsOfThisUser

    static getListings(searchTerm){
        return new Promise((resolve, reject) => {
            HttpService.get(this.baseURL(), function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static deleteListing(id) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${ListingService.baseURL()}/${id}`, function(data) {
                if(data.message != undefined) {
                    resolve(data.message);
                }
                else {
                    reject('Error while deleting');
                }
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static updateListing(listing) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${listing._id}`, listing, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }

    static createListing(listing) {
        return new Promise((resolve, reject) => {
            HttpService.post(ListingService.baseURL(), listing, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static reserveSpot(listing, user)
    {
        console.log("Reserve this spot.");
        return new Promise((resolve, reject) => {
            HttpService.post(`${ListingService.baseURL()}/reserveSpot`, {
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


    /**
     * return for the -host- the requests for one of their listings.
     * @param listing
     * @returns array of requests for that listing
     */
    static getRequestsForListing(listing){
        return new Promise((resolve, reject) => {
            console.log(`${this.baseURL()}/${listing._id}` + '/requests');
            HttpService.get(`${this.baseURL()}/${listing._id}` + '/requests', function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    /**
     * return for the -host- the contracts for one of their listings.
     * @param listing
     * @returns array of contracts for that listing
     */
    static getContractsForListing(listing){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${listing._id}/contracts`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }



}
"use strict";

import HttpService from './HttpService';

export default class RequestsService {

    constructor(){
    }

    static baseURL() {return "http://localhost:3000/requests" }

    /*
        request must be of the form:
        request : {
            "message" : "Hi! I'm also interested in your room a Gola di Lago",
            "startDate" : "X",
            "endDate" : "X",
            "listing" : "5b321db26fd23e0e023cf077", (ID)
            "sqrm" : "7"
        }
     */
    static createRequest(request) {
        return new Promise((resolve, reject) => {

            console.log("createRequest request:", request);

            HttpService.post(RequestsService.baseURL(), request, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static getRequests(){
       return new Promise((resolve, reject) => {
           HttpService.get(this.baseURL(), function(data) {
               resolve(data);
           }, function(textStatus) {
               reject(textStatus);
           });
       });
    }

    static getRequest(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${RequestsService.baseURL()}/${id}`, function(data) {
                if(data != undefined || Object.keys(data).length !== 0) {
                    resolve(data);
                }
                else {
                    reject('Error while retrieving Request');
                }
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    /**
     * - host - can accept a request from their interface
     * @param request_id
     * @returns confirmation of success: 200.
     */
    static accept(request_id){
        return new Promise((resolve, reject) => {
            HttpService.put(`${RequestsService.baseURL()}/${request_id}/accept`, function(inputData) {
                    console.log("sending input data (for decline, should be empty:", ...inputData);
                }, function(respData) {
                    resolve(respData);
                },
                function(textStatus) {
                    console.log("Text status was: ", ...textStatus);
                    reject(textStatus);
                });
        });
    }

    /**
     * - host - can decline a request from their interface
     * @param request_id
     * @returns confirmation of successful decline: 200.
     */
    static decline(request_id){
        return new Promise((resolve, reject) => {
            HttpService.put(`${RequestsService.baseURL()}/${request_id}/decline`, function(inputData) {
                console.log("sending input data (for decline, should be empty:", ...inputData);
            }, function(respData) {
                    resolve(respData);
            },
                function(textStatus) {
                console.log("Text status was: ", ...textStatus);
                reject(textStatus);
            });
        });
    }






}
"use strict";

import HttpService from './HttpService';
import UserService from "./UserService";

export default class ContractService {

    constructor(){

    }

    static baseURL() {return "http://localhost:3000/contracts" }

    static confirmDeposit(contract_id){
       return new Promise((resolve, reject) => {
           HttpService.put(`${this.baseURL()}/${contract_id}/confirmDeposit`, {} ,function(data) {
               resolve(data);
           }, function(textStatus) {
               reject(textStatus);
           });
       });
    }

    static confirmPickUp(contract_id){
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${contract_id}/confirmPickUp`, {} ,function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static payContract(contract_id, amount){
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${contract_id}/pay`, {amount: amount} ,function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }


}
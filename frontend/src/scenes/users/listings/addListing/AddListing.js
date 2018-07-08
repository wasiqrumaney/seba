"use strict";

import React from 'react';
import { Card, Button, FontIcon, TextField } from 'react-md';
import { withRouter } from 'react-router-dom'

import { AlertMessage } from '../../../../components/common/AlertMessage';
import Page from '../../../../components/Page';
import UserService from "../../../../services/UserService";
import {Input, Row} from "react-materialize";

const style = { maxWidth: 500 };


export class AddListing extends React.Component {

    constructor(props) {
        super(props);

        console.log("AddListing props: ", this.props );

        let currentUser = UserService.getCurrentUser();

        let owner_id = null;
        if ( currentUser != {} && currentUser != undefined){
            owner_id = currentUser.id
        } else {
            this.props.history.push('/users/listings/');
        }

        this.state = {
            title : '',
            description : '',
            address: {
                location : {
                    lat : '',
                    lng : '',
                },
                formatted_address : ''
            },
            owner_id : owner_id,
            price: '',
            sqrm: ''
        };

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeArea = this.handleChangeArea.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChangeTitle(event) {
        this.setState(Object.assign({}, this.state, {title: event.target.value}));
    }
    handleChangeDescription(event) {
        this.setState(Object.assign({}, this.state, {description: event.target.value}));
    }

    handleChangeAddress(event) {
        this.setState(Object.assign({}, this.state, {address: {formatted_address: event.target.value}}));
    }

    handleChangePrice(event) {
        this.setState(Object.assign({}, this.state, {price: event.target.value}));
    }

    handleChangeArea(event) {
        this.setState(Object.assign({}, this.state, {sqrm: event.target.value}));
    }

    handleSelect(address){
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error))
    }

    handleSubmit(event) {
        event.preventDefault();
        let listing = this.props.listing;
        if (listing == undefined) {
            listing = {};
        }
        listing.title = this.state.title;
        listing.description = this.state.description;
        listing.address = this.state.address;
        listing.owner_id = this.state.owner_id;
        listing.price = this.state.price;
        listing.sqrm = this.state.sqrm;

        console.log("handleSubmit listing:", listing, " props: ", this.props);

        this.props.onSubmit(listing);

    }

// value={this.state.title} required={true} onChange={this.handleChangeTitle}

    render() {

        return (
            <div className="container">
                <h4>Add Listing</h4>
            <div className="row">
                <form className="col s12" onSubmit={this.handleSubmit}>

                    <div className="row">
                        <div className="input-field col s12" >
                            {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                            <input value={this.state.title} id="title" type="text" className="validate" onChange={this.handleChangeTitle}/>
                                <label htmlFor="title">Title</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea value={this.state.description} id="description" type="text" className="validate materialize-textarea" onChange={this.handleChangeDescription}/>
                            <label htmlFor="description">Description</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input value={this.state.address.formatted_address} id="address" type="text" className="validate" onChange={this.handleChangeAddress}/>
                            <label htmlFor="address">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={this.state.price} id="price" type="number" className="validate" onChange={this.handleChangePrice}/>
                            <label htmlFor="price">Price</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={this.state.sqrm} id="sqrm" type="number" className="validate" onChange={this.handleChangeArea}/>
                            <label htmlFor="sqrm">Area</label>
                        </div>
                    </div>

                    {/*<div className="row">
                        <div className="file-field input-field col s12">
                            <div className="btn-small">
                                <span>Images</span>
                                <input type="file" multiple/>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" id="images" type="text"/>
                                <label htmlFor="images">Images</label>
                            </div>
                        </div>
                    </div>*/}

                    <button className="btn waves-effect waves-light" type="submit" name="action" >
                        Submit
                    </button>

                    <div className="row">
                        <div className="input-field col s12" >
                            <AlertMessage className="md-row md-full-width" >{this.props.error ? `${this.props.error}` : ''}</AlertMessage>
                        </div>
                    </div>

                </form>
            </div>
            </div>
        );
    }
}

// TODO
// DISABLED :: this.state.year.toString().length != 4 || this.state.title == undefined || this.state.title == '' || this.state.year == undefined || this.state.year == '' || this.state.synopsis == undefined || this.state.synopsis == ''
// Inser DISABLED button

export default withRouter(AddListing);
"use strict";

import React from 'react';
import { Card, Button, FontIcon, TextField } from 'react-md';
import { withRouter } from 'react-router-dom'

import { AlertMessage } from '../../../../components/common/AlertMessage';
import Page from '../../../../components/Page';
import UserService from "../../../../services/UserService";
import {Input, Row} from "react-materialize";

const style = { maxWidth: 500 };


class EditListing extends React.Component {

    constructor(props) {
        super(props);



        let currentUser = UserService.getCurrentUser();

        let owner_id = null;
        if ( currentUser != {} && currentUser != undefined){
            owner_id = currentUser.id
        } else {
            this.props.history.push('/users/listings/');
        }

        if(props.listing) {

            let _title = props.listing.title ? props.listing.title : '';
            let _description = props.listing.description ? props.listing.description : '';
            let _address;

            if (props.listing_address){
                let _formatted_address = props.listing.address.formatted_address ? props.listing.address.formatted_address : '';
                if (props.listing_address.location){
                    let _lat = props.listing.address.location.lat ? props.listing.address.location.lat : '';
                    let _lng = props.listing.address.location.lng ? props.listing.address.location.lng : '';
                }
                _address = {
                    location : {
                        lat : _lat,
                        lng : _lng,
                    },
                    formatted_address : _formatted_address,
                }
            } else {
                _address = {
                    location : {
                        lat : '',
                        lng : '',
                    },
                    formatted_address : ''
                }
            }

            this.state = {
                title : _title,
                description : _description,
                address : _address
            };
        }
        else {
            this.props.history.push('/users/listings/');
        }

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChangeTitle(event) {
        this.setState(Object.assign({}, this.state, {title: event.target.value}));
    }
    handleChangeDescription(event) {
        this.setState(Object.assign({}, this.state, {description: event.target.value}));
    }

    // TODO address here and in AddListing
    handleChangeAddress(event) {
        this.setState(Object.assign({}, this.state, {address: {formatted_address: event.target.value}}));
    }

    handleSubmit(event) {
        event.preventDefault();
        let Listing = this.props.listing;
        if (Listing == undefined) {
            Listing = {};
        }
        Listing.title = this.state.title;
        Listing.description = this.state.description;
        Listing.address = this.state.address;
        Listing.owner_id = this.state.owner_id;

        console.log(Listing);

        this.props.onSubmit(Listing);
    }

    render() {

        return (
            <div className="container">
            <div className="row">

                <H1>Listing {this.state.title} </H1>

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
                    <div className="file-field input-field col s12">
                        <div className="btn-small">
                            <span>Images</span>
                            <input type="file" multiple />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" id="images" type="text" />
                            <label htmlFor="images">Images</label>
                        </div>
                    </div>
                </div>

                <button className="btn waves-effect waves-light" type="submit" name="action" >
                    Submit
                </button>

                </form>
            </div>
            </div>
        );
    }
}

// TODO
// DISABLED :: this.state.year.toString().length != 4 || this.state.title == undefined || this.state.title == '' || this.state.year == undefined || this.state.year == '' || this.state.synopsis == undefined || this.state.synopsis == ''
// Inser DISABLED button

export default withRouter(EditListing);
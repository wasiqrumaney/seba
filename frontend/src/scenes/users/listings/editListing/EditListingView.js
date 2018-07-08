"use strict";

import React from 'react';

import ListingService from '../../../../services/ListingService';

import UsersView from "../../UsersView";
import EditListing from "./EditListing";

export class EditListingView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listing : undefined,
            error : undefined
        }
    }

    componentWillMount(){

        if(this.props.history.location.pathname == '/users/listings/add') {
            this.setState({
                loading: false,
                listing: undefined,
                error: undefined
            });
        }
        else if(this.props.location.state != undefined && this.props.location.state.listing != undefined) {
            this.setState({
                loading: false,
                listing: this.props.location.state.listing,
                error: undefined
            });
        }
        else {
            this.setState({
                loading: true,
                error: undefined
            });

            let id = this.props.match.params.id;

            ListingService.getListing(id).then((data) => {
                this.setState({
                    listing: data,
                    loading: false,
                    error: undefined
                });
            }).catch((e) => {
                console.error(e);
            });
        }
    }

    editListing(Listing) {
        if(!Listing) {
            ListingService.createListing(Listing).then((data) => {
                this.props.history.push('/');
            }).catch((e) => {
                console.error(e);
                this.setState(Object.assign({}, this.state, {error: 'Error while updating Listing'}));
            });
        } else {
            console.log("want to update listing: " + Listing);
            ListingService.updateListing(Listing).then((data) => {
                this.props.history.push('/users/listings/' + Listing.id);
            }).catch((e) => {
                console.error(e);
                this.setState(Object.assign({}, this.state, {error: 'Error while creating Listing'}));
            });
        }
    }

    render() {
        return (
            <UsersView>
                <EditListing onSubmit={(Listing) => this.editListing(Listing)} error={this.state.error} />
            </UsersView>
        );

        if (this.state.loading) {
            return (<h2>Loading...</h2>);
        }

        return (
            <EditListing listing={this.state.listing} onSubmit={(Listing) => this.editListing(Listing)} error={this.state.error} />
        );
    }
}

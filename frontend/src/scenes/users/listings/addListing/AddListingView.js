"use strict";

import React from 'react';

import AddListing from './AddListing';
import ListingService from '../../../../services/ListingService';
import Page from "../../../../components/Page";
import UsersNavigationWidget from "../../UsersNavigationWidget";
import UsersView from "../../UsersView";

export class AddListingView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listing : undefined,
            error : undefined
        }
    }

    // CreateListing
    createListing(Listing) {
            ListingService.createListing(Listing).then(() => {
                this.props.history.push('/users/listings/');
            }).catch((e) => {
                console.error("error while creating listing: ", e);
                this.setState(Object.assign({}, this.state, {error: 'Error while creating Listing: ' + e}));
            });
    }

    render() {
        return (
            <UsersView>
                <AddListing onSubmit={(listing) => this.createListing(listing)} error={this.state.error} />
            </UsersView>
        );
    }
}

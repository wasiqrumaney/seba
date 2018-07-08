"use strict";

import React from 'react';

import { SearchListingsDetails } from './SearchListingsDetails';

import ListingService from '../../services/ListingService';


export class SearchListingsDetailsView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.setState({
            loading: true
        });

        let id = this.props.match.params.id;

        console.log("SearchListingsDetailsView props: ",this.props );
        console.log("SearchListingsDetailsView id: ", id);

        if (id != undefined) {
            ListingService.getListing(id).then((data) => {
                this.setState({
                    listing: data,
                    loading: false
                });
            }).catch((e) => {
                console.error(e);
            });
        }

    }


    render() {
        return (
            <SearchListingsDetails loading={this.state.loading} listing={this.state.listing} />
        );
    }
}

"use strict";

import React from 'react';
import { FontIcon } from 'react-md';
import ListingService from '../../services/ListingService';
import { SearchListingsList } from './SearchListingsList';
import Page from "../../components/Page";
import { CardGroup, CardDeck, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import UserService from "../../services/UserService";
import { Link } from 'react-router-dom';
import { CardPanel } from 'react-materialize';

export class SearchListingsListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            search: (this.props.location.search).replace('?', ''),
            priceSearch: '',
            sqrmSearch: ''
        };
    }

    updateListing(evt) {
        this.setState({
            search: evt.target.value.toString().toLowerCase()
        });

    }
    updatePriceListing(evt) {
        this.setState({
            priceSearch: evt.target.value
        });

    }
    updateAreaListing(evt) {
        this.setState({
            sqrmSearch: evt.target.value
        });

    }

    componentWillMount(){
        this.setState({
            loading: true
        });

        ListingService.getListings().then((data) => {

            this.setState({
                data: [...data],
                loading: false,
                search: (this.props.location.search).replace('?', '')
            });

        }).catch((e) => {
            console.error(e);
        });
    }

    deleteListing(id) {
        this.setState({
            data: [...this.state.data],
            loading: true,
            search: this.props.location.search
        });
        ListingService.deleteListing(id).then((message) => {

            let ListingIndex = this.state.data.map(Listing => Listing['_id']).indexOf(id);
            let Listings = this.state.data;
            Listings.splice(ListingIndex, 1);
            this.setState({
               data: [...listings],
               loading: false,
                search: this.props.location.search
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <Page>
                    <div className="row">
                        <div className="col s3 text-center">
                            <input placeholder={'Search by location'} type="text" value={this.state.search} onChange={this.updateListing.bind(this)}/>
                            <input placeholder={'Search by Price'} type="text" value={this.state.priceSearch} onChange={this.updatePriceListing.bind(this)}/>
                            <input placeholder={'Search by Area'} type="text" value={this.state.sqrmSearch} onChange={this.updateAreaListing.bind(this)}/>
                        </div>
                        <div className="col s9">
                            <CardDeck style={{display: 'flex', flexWrap: 'wrap'}}>
                                <h6>loading...</h6>
                            </CardDeck>

                        </div>
                    </div>
                </Page>
            );
        }

        let filteredList = [];
        for (let index = 0; index < this.state.data.length; index++) {
            let v = this.state.data[index].address.formatted_address;
            let priceSearch = this.state.data[index].price;
            let sqrmSearch = this.state.data[index].sqrm;
            if (v.toString().toLowerCase().indexOf(this.state.search) !== -1
                && priceSearch.toString().indexOf(this.state.priceSearch) !== -1
                && sqrmSearch.toString().indexOf(this.state.sqrmSearch) !== -1)
            {
                filteredList.push(this.state.data[index]);
            }
        }

        return (
            <Page>
                <div className="row">
                    <div className="col s3 text-center">
                        <CardPanel>
                            <input placeholder={'Search by location'} type="text" value={this.state.search} onChange={this.updateListing.bind(this)}/>
                            <input placeholder={'Search by Price'} type="text" value={this.state.priceSearch} onChange={this.updatePriceListing.bind(this)}/>
                            <input placeholder={'Search by Area'} type="text" value={this.state.sqrmSearch} onChange={this.updateAreaListing.bind(this)}/>
                        </CardPanel>
                    </div>
                    <div className="col s9">
                        <SearchListingsList data={filteredList} onDelete={(id) => this.deleteListing(id)}/>
                    </div>
                </div>
            </Page>
        );
    }
}

import React from 'react';

import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router'
import EditView from '../src/scenes/users/edit/EditView'

import ListingsView from "../src/scenes/users/listings/ListingsView";
import RequestsView from "../src/scenes/users/requests/RequestsView";
import Header from "../src/components/common/Header";
import HomeView from "../src/scenes/home/HomeView";
import {AddListingView} from "../src/scenes/users/listings/addListing/AddListingView";


import {withRouter} from "react-router-dom";
import AddListing from "../src/scenes/users/listings/addListing/AddListing";
import UserLogin from "../src/scenes/sign/UserLogin";
import SingleListingView from "../src/scenes/users/listings/singleListing/SingleListingView";
import {PendingPlacesTab, ActivePlacesTab, PastPlacesTab} from "../src/scenes/users/places/MyPlacesView";
import YourPlacesView from "../src/scenes/users/places/MyPlacesView";
import {SearchListingsDetailsView} from "../src/scenes/search/SearchListingsDetailsView";
import MeView from "../src/scenes/me/MeView";
import PublicProfileView from "../src/scenes/public/PublicProfileView";

storiesOf('TODO', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ));

storiesOf('Homepage', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('SearchBar', () => <HomeView />)
    .add('details', () => <SearchListingsDetailsView match={{params : {id: "5b34a69f3375d7194ad82dec"}}} />);


storiesOf('Users', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('Edit', () => <EditView />)
    .add('Listings', () => <ListingsView />)
    .add('AddListings', () => <AddListing />)
    .add('Requests', () => <RequestsView />);



storiesOf('Common', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('header', () => <Header />)
    .add('users login', () => <UserLogin />);

const fakeListing = {
    "baloney" : {
        "state": {
            "listing":
                {
                    "address":
                        {
                            "location": {"lat": 48, "lng": 11},
                            "formatted_address": "Schellingstrasse 50"
                        },
                    "requests": [],
                    "_id": "5b2bc55eb91e5a649b9af0f9",
                    "title": "25 m^2, Maxvorstadt",
                    "description": "Reachable with u-bahn and public transport. 24 hours / 7 days available.",
                    "__v": 0
                }
        }
    }};


storiesOf('Host', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('Single Listing', () => <SingleListingView />)
    .add('Single Listing with Data', () => <SingleListingView {...fakeListing} />);


storiesOf('Seeker', module)
    .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
))
    .add('Your Places', () => <YourPlacesView />)
    .add('Pending (requests)', () => <PendingPlacesTab {...{"id":"pending"}} />)
    .add('Active (contracts)', () => <ActivePlacesTab {...{"id":"active"}} />)
    .add('Past (contracts)', () => <PastPlacesTab {...{"id":"past"}} />);

const example = {

    name : "james"

}

storiesOf('Profile', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('Private', () => <MeView />)   /* PUBLIC ID OF CONRADT :: 5b34a4f03375d7194ad82dea */
    .add('Public', () => <PublicProfileView storybook={true} id={"5b34a4f03375d7194ad82dea"} data={example} />);
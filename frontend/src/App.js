"use strict";

import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { SearchListingsListView } from './scenes/search/SearchListingsListView';
import { HomeView } from './scenes/home/HomeView'

import { UserLoginView } from "./scenes/sign/UserLoginView";
import { UserSignupView } from "./scenes/sign/UserSignupView";
import { SearchListingsDetailsView }   from './scenes/search/SearchListingsDetailsView';

import EditView from './scenes/users/edit/EditView';
import UserService from "./services/UserService";
import RequestsView from "./scenes/users/requests/RequestsView";
import TagsView from "./scenes/users/tags/TagsView";
import ListingsView from "./scenes/users/listings/ListingsView";
import {AddListingView} from "./scenes/users/listings/addListing/AddListingView";
import {EditListingView} from "./scenes/users/listings/editListing/EditListingView";
import MyPlacesView from "./scenes/users/places/MyPlacesView";
import {SingleListingView} from "./scenes/users/listings/singleListing/SingleListingView";
import MeView from "./scenes/me/MeView";
import PublicProfileView from "./scenes/public/PublicProfileView";

// ICON !!
require('./favicon.ico');

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Store4me',
            routes: [
                { component: SearchListingsListView , path: '/search', exact: true},
                { component: SearchListingsDetailsView , path: '/show/:id', exact: true},
                { component: HomeView , path: '/', exact: true},
                { component: UserLoginView, path: '/login', exact: true},
                { component: UserSignupView, path: '/register', exact: true},
                { component: PublicProfileView , path: '/users/public/:id', exact: true},
                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<EditView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/edit', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<RequestsView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/requests', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<ListingsView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/listings', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<AddListingView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/listings/add', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<TagsView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/tags', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<EditListingView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)
                        }} , path: '/users/listings/edit/:id', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<ListingsView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)
                        }} , path: '/users/listings/:id', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<MeView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)
                        }} , path: '/users/me', exact: true},

                { render: (props) => {
                        if(UserService.isAuthenticated()) {
                            return (<MyPlacesView {... props} />)
                        }
                        else {
                            return (<Redirect to={'/login'}/>)

                        }} , path: '/users/myplaces', exact: true},
            ]
        };
    }

    componentDidMount(){
        document.title = this.state.title;
    }

    render() {
        return(
            <div>
                <Router>
                    <Switch>
                        {this.state.routes.map((route, i) => (<Route key={i} {...route} />) )}
                        <Redirect from="/users" to="/users/edit" exact="true" />
                    </Switch>
                </Router>
            </div>
        );
    }
}


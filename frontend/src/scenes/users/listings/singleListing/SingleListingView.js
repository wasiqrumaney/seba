"use strict";

import React from 'react';
import Page from '../../../../components/Page';
import UsersView from "../../UsersView";
import munich5 from '../images/parallax1.jpg';
import ListingService from "../../../../services/ListingService";
import {Link, withRouter} from 'react-router-dom'
import ViewEditListing from './ViewEditListing';
import RequestsForListing from './RequestsForListing';
import ContractsOfListing from './ContractsOfListing';

class SingleListingView extends React.Component {

    constructor(props) {
        super(props);
        console.log("SingleListingView constructor: ", this.props );

        this.state = {
            loading : true,
            error: undefined,
            firstLoad: false
        }
    }



    componentWillMount(){
        if(this.props.location.state && this.props.location.state.listing) {

            console.group("componentWillMount : IF STATE", this.props.location.state.listing );

            this.setState({
                loading: false,
                listing: this.props.location.state.listing,
                error: undefined
            });

            //console.log(this.state.listing.title);
            console.groupEnd();
        }
        else {
            let id = this.props.match.params.id;

            console.log("id:" + id);

            if (id){
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
    }

    componentWillReceiveProps(nextProps){

        let id = nextProps.match.params.id;
        console.group("componentWillReceiveProps");
        console.log("nextProps",nextProps);
        console.log("id", id);
        if (id && nextProps.location.state) {
            ListingService.getListing(id).then((data) => {
                    console.log("getListing(id) data:", data);
                    this.setState({
                        listing: data,
                        loading: false,
                        error: undefined
                    });
                    console.log("this.state.listing", this.state.listing);
                }).catch((e) => {
                    console.error(e);
            });
        }
    }


    render() {

        if (this.state.loading){
            if (this.props.userHasListings !== true) {
                return (<div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-image">
                                    <img src={munich5} style={{height: "200px"}}/>
                                    <span className="card-title">Your Listings</span>
                                </div>
                                <div className="card-content blue-grey lighten-3">
                                    <p>Right now you don't have any listings.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            }
            else {
                return (<div className="row">
                    <div className="col s12">
                        <div className="card">
                            <div className="card-image">
                                <img src={munich5} style={{height: "200px"}}/>
                                <span className="card-title">Your Listings</span>
                            </div>
                            <div className="card-content blue-grey lighten-3">
                                <p>Select one of your listings from the list on the left!</p>
                            </div>
                        </div>
                    </div>

                </div>
                );
            }

        }

        return(
            <div style={{minHeight:"588px"}} className="card white ">

                <div className="card-content">

                <div className="row" style={{marginBottom:"0px"}}>
                    <div className="col s12">
                    <div className="card-title white z-depth-3" style={{padding:"12px"}}>
                        {this.state.listing.title} <a className="waves-effect waves-light btn disabled"><i className="material-icons">create</i></a>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <ul id="singleListingMenu" className="tabs teal lighten-1">
                            <li className="tab col s4"><a className="active" href="#viewEdit"><i
                                className="material-icons">search</i><i
                                className="material-icons">create</i> View & Edit</a></li>
                            <li className="tab col s4"><a href="#requests" ><i className="material-icons">chat</i>Requests (x)</a>
                            </li>
                            <li className="tab col s4"><a href="#contracts" ><i className="material-icons">assignment</i>Contracts (x)</a>
                            </li>
                        </ul>
                    </div>
                    <div id="viewEdit" className="col s12"><ViewEditListing {... this.props} /></div>
                    <div id="requests" className="col s12"><RequestsForListing {... this.props} /></div>
                    <div id="contracts" className="col s12"><ContractsOfListing {... this.props} /></div>
                </div>
                </div>

            </div>
        );
    } // TODO: Remove tabs blue and properly sort out SASS
    // TODO: Use later for requests: https://stackoverflow.com/questions/47765395/how-to-initialize-javascript-at-materialize-1-0
}

export default withRouter(SingleListingView);
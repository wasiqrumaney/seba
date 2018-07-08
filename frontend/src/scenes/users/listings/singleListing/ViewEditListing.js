"use strict";

import React from 'react';
import ListingService from "../../../../services/ListingService";
import {Link, withRouter} from 'react-router-dom'

class ViewEditListing extends React.Component {

    constructor(props) {
        super(props);
        console.log("ViewEditListing constructor: ", this.props );

        this.state = {
            loading : true,
            error: undefined
        }
    }

    componentDidMount() {
        console.log("before");
        $(document).ready(function() {
            console.log("viewEditRequest - mounting");
            $('#singleListingMenu').tabs();
            $('.tabs').tabs();
            console.log("done");
            console.log($("#singleListingMenu"));
        });

    }


    componentWillMount(){
        console.log("Single Listing View will mount?")
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
        console.log("View EDIT");
        if(nextProps.location.state && nextProps.location.state.listing) {

            console.log("nextProps.location.state", nextProps.location.state != undefined);
            console.log("nextProps.location.state.listing", nextProps.location.state.listing);

            this.setState({
                loading: false,
                listing: nextProps.location.state.listing,
                error: undefined
            });
        }
        else {
            if (id) {
                ListingService.getListing(id).then((data) => {
                    console.log("SinglegetListing(id) data:", data);
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
        console.groupEnd();

    }

    allowEdit() {
        console.log("Click!")
        conolse.log(this)
    }

    render() {

        // TODO: Add appropiate background image
        if (this.state.loading) {
            return (<div className="row">
                    Unfortunately an error occured, the listing could not be accessed
                </div>
            );

        }

        console.log(this.state.listing);

        let img_listing = {};
        if (this.state.listing.image) {
            img_listing = "data:" + this.state.listing.image.contentType + ";base64," + this.state.listing.image.data
        }
        return (
            <div className="card">
                <div className="card-content">
                    <div className="row">
                        <i className="material-icons">short_text</i> Description <br/>
                        <span id="description">
                            {this.state.listing.description}</span>
                    </div>
                    <div className="col s12 m6 valign-wrapper">
                        <img className="ratioSquareBig circle responsive-img center-align" src={img_listing} />
                    </div>
                    <div className="col s12 m6">
                        <div className="row">
                            <i className="material-icons">map</i><span
                            id="address"><br/> {this.state.listing.address.formatted_address}</span>
                        </div>

                        <div className="row">
                            Statistics:
                            <div id="requestCount">
                                Total Requests: {this.state.listing.requests.length}
                            </div>
                            <div id="requestCount">
                                Total Contracts: 0
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    <a className="waves-effect waves-light btn red disabled"><i
                        className="material-icons left">fullscreen</i>Delete Listing</a>
                </div>
            </div>
        );
    }
}

export default withRouter(ViewEditListing);
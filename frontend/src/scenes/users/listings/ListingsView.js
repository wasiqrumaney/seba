"use strict";

import React from 'react';

import ListingService from '../../../services/ListingService';

import Page from '../../../components/Page'
import UserService from "../../../services/UserService";
import {Link, withRouter} from 'react-router-dom';
import {CardTitle} from 'react-materialize';
import UsersNavigationWidget from "../UsersNavigationWidget";
import UsersView from "../UsersView";
import munich1 from './images/parallax1.jpg';
import munich5 from './images/munich5.jpg';
import SingleListingView from "./singleListing/SingleListingView";

import StatusYes from "../../../components/common/Display/StatusYes";
import StatusNo from "../../../components/common/Display/StatusNo";
import {AddListing} from "./addListing/AddListing";
import style from "../../../components/common/ImageSpecifics.css";

class ListingsView extends React.Component {

    constructor(props) {

        console.log(props);

        super(props);

        this.state = {
            loading: false,
            data: [],
            addMode: false
        };

        this.handleAddListing = this.handleAddListing.bind(this);
    }

    componentWillMount(){
        this.setState({
            loading: true
        });

        const idAndEmail = UserService.getCurrentUser();
        const thisUserID = idAndEmail['id'];
        console.log("user is", thisUserID);
        ListingService.getListingByUserId(thisUserID).then((data) => {

            console.log("will mount:");
            console.log(data);

            this.setState({
                data: [...data],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }

    deleteListing(id) {
        this.setState({
            data: [...this.state.data],
            loading: true
        });
        ListingService.deleteListing(id).then((message) => {

            console.log("Listing with id: " . id );

            let listingIndex = this.state.data.map(listing => listing['_id']).indexOf(id);
            let listings = this.state.data;
            listings.splice(listingIndex, 1);
            this.setState({
               data: [...listings],
               loading: false
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    handleAddListing() {
        this.setState({
            addMode: !this.state.addMode
        });
    }

    render() {

        if (this.state.loading) {
            return (
                <UsersView>
                    <div className="col s12">
                        <div className="card">
                            <div className="card-image" style={{height:"180px", maxHeight:"180px", overflow:"hidden"}}>
                                <img src={munich5}/>
                                <span className="card-title">Your Listings
                                 <div style={{width:"20px"}} /> <button onClick={this.handleAddListing} className="waves-effect waves-light btn green">
                                    <i className="material-icons">add</i> Add Listing
                                </button>
                                </span>
                            </div>
                            <div className="card-content row">
                                <div className="col s4" style={{display:"block",
                                    height:"600px",
                                    overflow:"auto"}}>
                                    {""}
                                </div>
                            </div>
                        </div>
                    </div>
                </UsersView>);
        }

    return (
                <UsersView>
                    <div className="col s12">
                        <div className="card">
                            <div className="card-image" style={{height:"180px", maxHeight:"180px", overflow:"hidden"}}>
                                <img src={munich5}/>
                                <span className="card-title">Your Listings
                                 <div style={{width:"20px"}} /> <button onClick={this.handleAddListing} className="waves-effect waves-light btn green">
                                    <i className="material-icons">add</i> Add Listing
                                </button>
                                </span>
                            </div>
                    <div className="card-content row">
                        <div className="col s4" style={{display:"block",
                            height:"600px",
                            overflow:"auto"}}>

                                    {this.state.data.map((listing, i) => <ListingsListRow key={i} listing={listing} onDelete={(id) => this.deleteListing(id)} />)}

                        </div>
                        <ListingsViewWindow {...this.props} listingCount={this.state.data.length} addMode={this.state.addMode} />
                    </div>
                        </div>
                    </div>

                </UsersView>
            );
    }
}
export default withRouter(ListingsView);

export class ListingsViewWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listing : undefined,
            error : undefined
        }

        console.log("ListingsViewWindow props: ", this.props);
    }

    // CreateListing
    createListing(Listing) {
        ListingService.createListing(Listing).then(() => {

            if (this.props.history){
                this.props.history.push('/users/listings/');
            } else {
                location.reload();
            }

        }).catch((e) => {
            console.error("error while creating listing: ", e);
            this.setState(Object.assign({}, this.state, {error: 'Error while creating Listing: ' + e}));
        });
    }


    render() {
        const userHasListings = this.props.listingCount !== 0;

        if (this.props.addMode === true){
            return(<div className="card col s8"> <AddListing onSubmit={(listing) => this.createListing(listing)} error={this.state.error} /></div>);
        }
        return(
            <div className="col s8">
            <SingleListingView userHasListings={userHasListings} />
        </div>);
    }

}


class ListingsListRow extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.listing.image) this.props.listing.image = "default.png";
        return (
            <div className="card blue lighten-5">
                    <div className="row card-content">
                        <span className="card-title">
                            <Link to={{pathname: `/users/listings/${this.props.listing._id}`, state : {listing : this.props.listing}}}>
                                {this.props.listing.title}
                            </Link>
                        </span>
                        <div className="col s6 valign-wrapper">
                            <img className="responsive-img center-align" src={"data:" + this.props.listing.image.contentType + ";base64," + this.props.listing.image.data}  />
                        </div>
                        <div className="col s6">
                                <div className="row">Requests: <span className="left-align badge new">{this.props.listing.requests.length} </span></div>
                            <div className="row">Occupied: <StatusNo /></div>
                                <div className="row">Published: <StatusYes /></div>
                        </div>
                    </div>
            </div>
        );
    }
}

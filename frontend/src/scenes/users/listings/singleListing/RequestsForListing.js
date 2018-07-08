"use strict";

import React from 'react';
import ListingService from "../../../../services/ListingService";
import RequestsService from "../../../../services/RequestsService";
import {Link, withRouter} from 'react-router-dom'
import UserService from "../../../../services/UserService";
import ContractService from "../../../../services/ContractService";


class RequestsForListing extends React.Component {

    constructor(props) {
        super(props);
        console.log("RequestsForListing constructor: ", this.props );

        this.state = {
            loading : true,
            error: undefined
        }

    }


    componentWillMount(){
        if(this.props.location.state && this.props.location.state.listing) {

            console.group("componentWillMount : IF STATE", this.props.location.state.listing );

            ListingService.getRequestsForListing(this.props.location.state.listing).then((data) => {
                this.setState({
                    listing: this.props.location.state.listing,
                    requests: data,
                    loading: false,
                    error: undefined
                });
            }).catch((e) => {
                console.error(e);
            });

            //console.log(this.state.listing.title);
            console.groupEnd();
        }
        else {
            let id = this.props.match.params.id;
            console.log("id:" + id);
            if (id){
                ListingService.getListing(id).then((listing) => {
                    ListingService.getRequestsForListing(listing).then((data) => {
                        this.setState({
                            listing: this.state.listing,
                            requests: data,
                            loading: false,
                            error: undefined
                        });
                    }).catch((e) => {
                        console.error(e);
                    });
                });
            }
            else {
                console.log("NO ID!")
            }
        }
    }

     componentWillReceiveProps(nextProps){


        console.log("Will get props..");
        let id = nextProps.match.params.id;
        console.group("componentWillReceiveProps");
        console.log("nextProps",nextProps);
        console.log("id", id);
        console.log("Requests!");

        if (id && nextProps.location.state) {
            ListingService.getRequestsForListing(nextProps.location.state.listing).then((data) => {
                console.log("getRequestsForListing(id) data:", data);
                this.setState({
                    requests: data,
                    loading: false,
                    error: undefined
                });
                console.log("Requests returned:", this.state.requests);
            }).catch((e) => {
                console.error(e);
                this.setState({
                    requests: undefined,
                    loading: true,
                    error: e
                });
            });
        }
        console.groupEnd();

    }


    render() {

        if (this.state.loading) {
            return (<div className="card">
                <div className="card-content">
                    <div className="row">
                    You do not own this listing!
                </div>
                </div>
                </div>
            );

        }

        console.log(this.state.requests);
        return (
            <div className="card">
                <div className="card-content">
                    <div className="row">
                        <table>
                            <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Requestee / Message</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {this.state.requests.map((request, i) => <RequestsListRow key={i} request={request}  />
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }
}

export default withRouter(RequestsForListing);




class RequestsListRow extends React.Component {

    constructor(props) {

        super(props);

        this.state = { status: this.props.request.status };

    }

    cb (msg) {
        console.log('doing things here', msg)
        this.state.status = msg;
    }

    render() {
        const color = ((status) => {
            switch(status) {
                case 'accepted':
                    return 'green lighten-3';
                    case 'declined':
                    return 'red lighten-3';
                    default:
                    return 'white';
            }})(this.state.status);

        const startDate = new Date(this.props.request.startDate).toLocaleDateString("en-US");
        const endDate = new Date(this.props.request.endDate).toLocaleDateString("en-US");
        return (
            <tr className={color}>
                <td>{startDate}</td>
                <td>{endDate}</td>
                <td>(seeker.name.first (and last) wrote:
                    <blockquote style={{borderLeft: "5px solid #00897b"}}>{this.props.request.message}</blockquote></td>
                <td><RequestRowActions {...this.props} cb={this.cb}/></td>
            </tr>
        );
    }
}


class RequestRowActions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            request: this.props.request
        };

        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
        this.callService = this.callService.bind(this);
    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    componentDidUpdate(prevProps) {
        if (this.props.request !== prevProps.request) {
            this.setState(this.state);
        }
    }

    callService(action, request_id){

        if (action == "accept") {
            RequestsService.accept(request_id).then((data) => {
                console.log("this is:", this);
                this.setState({
                    request: data
                });
                console.log("after");
            }).catch((e) => {
                console.log("error state:");
                console.error(e);
            })
        }


        else if (action == "decline") {
            console.log("Declingin!");
            RequestsService.decline(request_id).then((data) => {
                this.setState({
                    request: data
                });
            }).catch((e) => {
                console.error(e);
            })
        }
    }


    handleAccept(){
        this.callService("accept", this.state.request._id)
    }

    handleDecline(){
        this.callService("decline", this.state.request._id)
    }


    render() {
        if (this.state.request.status === 'accepted') {
            return (
                <span>
                    <i className="material-icons">thumb_up</i> Accepted <br />
                </span>
            );
        } else if (this.state.request.status === 'declined') {
            return (
                <span>
                    <i className="material-icons">thumb_down</i> Request was declined
                </span>
            );
        }
        else {
            return (
                <span className="input-field">
                    <i className="material-icons">thumbs_up_down</i> Pending <br/>
                    <button className="btn-small green waves-effect waves-light" type="submit" name="action" onClick={this.handleAccept}><i className="material-icons">check</i>Accept</button><br />
                    <button className="btn-small red waves-effect waves-light" type="submit" name="action" onClick={this.handleDecline}><i className="material-icons">close</i>Decline</button>
                </span>

            );
        }
    }
}

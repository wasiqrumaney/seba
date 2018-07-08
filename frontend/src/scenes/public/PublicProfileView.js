"use strict";

import React from 'react';
import UserService from "../../services/UserService";
import {Link, withRouter} from 'react-router-dom'
import UsersView from "../users/UsersView";
import munich4 from "../home/images/munich4.jpg"
import ListingService from "../../services/ListingService";


class PublicProfileView extends React.Component {

    constructor(props) {
        super(props);
        console.log("PublicProfileView constructor: ", this.props );

        this.state = {
            loading : true,
            error: undefined,
            user : undefined
        }
    }


    componentWillMount(){
        let id = this.props.match.params.id;

        /* For storybook */

        console.log("this.prop.data:", this.props.data);
            // TODO for correct mocking, given node problem
        console.log("profile:", this.props.storybook, this.props.id);
        if (this.props.storybook == true){
            id = this.props.id;
        }

        if (id){
            UserService.public(id).then((user) => {
                return Promise.all([Promise.resolve(user), ListingService.getListingByUserId(user._id)])
            }).then( (promises) => {
                this.setState({
                    user: promises[0],
                    loading: false,
                    listings : promises[1],
                    error: undefined
                });
            }).catch((e) => {
                console.error(e);
                this.setState({
                    user: user,
                    loading: false,
                    error: "User with such ID does not exist."
                });
            });
        }
    }


    render() {

        if (this.state.loading){
            return(<div className="row">
                    <div className="col s12">
                        <div className="card">
                            loading...
                        </div>
                    </div>
                </div>
            );
        }

        if (this.state.error){
            return(<div className="row">
                    <div className="col s12">
                        <div className="card">
                            {this.state.error}
                        </div>
                    </div>
                </div>
            );
        }

        let profile_image = "";
        if (this.state.user.image) {
            profile_image = "data:" + this.state.user.image.contentType + ";base64," + this.state.user.image.base64;
        }

        let listings = ""
        if(this.state.listings) {
            listings = this.state.listings.map((l, i) => <ListingsRow key={i} listing={l}/>);
        }

        return(
            <UsersView>
                    <div className="col s12">
                        <div className="card">
                            <div className="card-image" style={{height:"180px", maxHeight:"180px", overflow:"hidden"}}>
                                <img src={munich4} style={{ "top": "-64%" }}/>

                            </div>
                            <div className="container" >
                                <div className="row s2">

                                    <div className="col s12">
                                        <img className="icon hide-on-med-and-down circle"
                                             src={profile_image}
                                             alt="profile" />
                                    </div>
                                    <div className="col s10">
                                        <h5 className="card-title valign-wrapper">
                                            {this.state.user.name.first + " " + this.state.user.name.last}
                                        </h5>
                                    </div>

                                </div>

                                <div className="col s12 collection">
                                    <div className="card-content">
                                        <h5>All listings of {this.state.user.name.first}: </h5>
                                        {listings}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </UsersView>
        );
    }
}

class ListingsRow extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="collection-item">
                <Link to={"/show/" + this.props.listing._id} >
                {this.props.listing.title}
                </Link>
            </div>
        );
    }
}

export default withRouter(PublicProfileView);
"use strict";

import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import UsersView from "../users/UsersView";
import munich4 from "../home/images/munich4.jpg"
import UserService from "../../services/UserService";
import default_profile_image from "../../components/common/defaultProfile.jpg"

class MeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined,
            loading: true,
            balance : 0
        };
    }

    componentDidMount(){

        UserService.me().then((data) => {

            this.setState({
                user: data,
                loading: false,
                message: ""
            });
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: e
            });
        });
    }

    handleChangeBalance(event){
        this.setState({
            balance: event.target.value,
        });
    }

    incrementBalance(){
        this.setState({
            message: "Making the payment..."
        });
        UserService.incrementBalance(this.state.balance).then((user) => {
            this.setState({
                user: user,
                loading: false,
                message: "Your balance has successfully been incremented by " + this.state.balance,
            });
        }).catch((message) => {
            this.setState({
                message : message.toString()
            });
        });
    }


    render() {

        if (this.state.loading){
            return(<UsersView />);
        }

        let profile_image = default_profile_image;
        if (this.state.user.image) {
            profile_image = "data:" + this.state.user.image.contentType + ";base64," + this.state.user.image.base64;
        }

        return (
            <UsersView>
                <div className="col s12">
                    <div className="card">
                        <div className="card-image" style={{height:"180px", maxHeight:"180px", overflow:"hidden"}}>
                            <img src={munich4} style={{ "top": "-64%" }}/>
                        </div>

                        <div className="col s12 collection">

                            <div className="collection-item">
                                <h5>
                                    {this.state.user.name.first + " " + this.state.user.name.last}
                                </h5>

                                <h6>
                                    Private profile and settings
                                </h6>
                            </div>

                            <div className="collection-item">
                                <h5>Balance : {this.state.user.balance}</h5>
                                <span>increment your total balance</span>

                                <div className="row s12" >
                                <div className="input-field col s6" >
                                    <input value={this.state.balance} id="balanceID" type="value" className="validate" onChange={(e) => this.handleChangeBalance(e)} />
                                </div>

                                <button className="btn-small col s6" type="submit" name="action" onClick={() => this.incrementBalance()}  >
                                    Increment
                                </button>

                                </div>

                                <span>{this.state.message}</span>

                            </div>

                            <UserPromptInfoDynamic {...this.props} />

                        </div>
                    </div>
                </div>
            </UsersView>
        );
    }
}

class UserPromptInfoDynamic extends React.Component {

    /*
        newHostAndSeeker : special message if a host or a seeker become host and seeker
    */

    constructor(props) {
        super(props);
        this.state = {
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined,
            newHostAndSeeker : false,
            error : ""
        }
    }


    componentDidMount(){

        UserService.me().then((data) => {
            this.setState({
                user: data
            });
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: e
            });
        });
    }

    becomeHostOrSeeker(){

        UserService.becomeHostSeeker().then((user) => {
            this.setState({
                user: user,
                newHostAndSeeker : true
            });
        }).catch((e) => {
            this.setState({
                error : e
            });
        });
    };

    render(){

        let u = this.state.user;

        if (!u){
            return (<UserPromptInfoGuest />);
        }

        const host = u.host;
        const seeker = u.seeker;

        if(host === true && seeker === true){
            return (<UserPromptInfoHostSeeker user={this.state.user} new={this.state.newHostAndSeeker} />);
        } else if (host === true){
            return (<UserPromptInfoHost user={this.state.user} onBecome={() => this.becomeHostOrSeeker()} error={this.state.error} />);
        } else if (seeker === true){
            return (<UserPromptInfoSeeker user={this.state.user} onBecome={() => this.becomeHostOrSeeker()} error={this.state.error} />);
        } else {
            return (null);
        }
    }

}


class UserPromptInfoHost extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            button : "Become a seeker"
        }

    }

    handleBecome(){
        this.props.onBecome();
        this.setState(
            {
                button : "wait a moment ..."
            }
        );
    }

    componentDidUpdate(nextProps){
        if (nextProps.error != "") {
            this.setState(
                {
                    button : "Become a seeker"
                }
            )
        }
    }

    render(){
        return(
            <div className="card-content">

                <div className="col s12">
                    Interested in renting space out somewhere else?
                </div>

                <div className="col s12">
                    <span className="btn-small" onClick={() => this.handleBecome()}>{this.state.button}</span>
                </div>

                <div className="col s12">
                    <span>{this.props.error}</span>
                </div>
            </div>
        );
    }
}

class UserPromptInfoHostSeeker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="card-content">
                <div className="col s12">
                    <i className="material-icons">check</i>Host and Seeker
                </div>
            </div>
        );
    }
}

class UserPromptInfoSeeker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            button : "Become a host"
        }

    }

    handleBecome(){
        this.props.onBecome();
        this.setState(
            {
                button : "wait a moment ..."
            }
        );
    }

    componentDidUpdate(nextProps){
        if (nextProps.error != "") {
            this.setState(
                {
                    button : "Become a host"
                }
            )
        }
    }

    render(){
        return(
            <div>
                <div className="card-content">
                    Check your listings at the following link: <Link to="/users/listings">listings</Link>
                </div>

                <div className="card-content">
                    Interested in earning money in your spare time?
                    <span className="btn-small" onClick={() => this.handleBecome()} style={{"marginLeft":"5px"}}>{this.state.button}</span>
                    <span>{this.props.error}</span>
                </div>
            </div>
        );
    }
}


export default withRouter(MeView);
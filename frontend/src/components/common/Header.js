"use strict";

import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import UserService from "../../services/UserService";

import M, {Dropdown} from 'materialize-css';
import {NavItem} from "react-materialize";

import logo_img from "./logo.png"
import default_profile_image from "./defaultProfile.jpg"

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">

                <nav role="navigation">
                    <div className="container">
                        <div className="nav-wrapper">
                            <div className="row">
                            <div className="col s4">
                                <a href="/" className="brand-logo">
                                    <img height="65" className="icon hide-on-med-and-down"
                                                                        src={logo_img}
                                                                        alt="store4me" />
                                </a>
                            </div>
                                <NavBarDynamic {...this.props} />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );

    }

}

export default withRouter(Header);


class NavBarDynamic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined
        }
        this.logout = this.logout.bind(this)
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


    logout() {
        UserService.logout();
        this.state = {
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined
        };
        if(this.props.location.pathname != '/') {
            this.props.history.push('/');
        }
        else {
            window.location.reload();
        }
    }

    render(){

        let u = this.state.user;

        if (!u){
            return (<NavBarGuest logout={() => {this.logout(); }} />);
        }

        const host = u.host;
        const seeker = u.seeker;
        if(host === true && seeker === true){
            return (<NavBarHostSeeker user={this.state.user} logout={() => this.logout()} />);
        } else if (host === true){
            return (<NavBarHost user={this.state.user} logout={() => this.logout()} />);
        } else if (seeker === true){
            return (<NavBarSeeker  user={this.state.user} logout={() => this.logout()}  />);
        } else{
            return (<NavBarGuest user={this.state.user} logout={() => this.logout()} />);
        }
    }

}




class NavBarGuest extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="col s6">
                <ul className="right">
                    <li>
                        <Link to="/search"><i className="material-icons">search</i></Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

class NavBarHost extends React.Component{
    constructor(props){
        super(props);
    }

    render() {

        let profile_image = default_profile_image;
        if (typeof(this.props.user.image) != "undefined"){
            profile_image = "data:" + this.props.user.image.contentType + ";base64," + this.props.user.image.base64;
        }
        return(
            <div className="col s6">
                <ul className="right">
                    <li>
                        <Link to="/search"><i className="material-icons">search</i></Link>
                    </li>
                    <li>
                        <Link to="/users/listings">Listings</Link>
                    </li>
                    <li>
                        <Link to="/users/me"><img height="55" className="icon hide-on-med-and-down circle"
                                                  src={profile_image}
                                                  alt="profile" style={{"margin": "5px"}}/>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={() => this.props.logout()}>logout</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

class NavBarHostSeeker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let profile_image = default_profile_image;
        if (typeof(this.props.user.image) != "undefined"){
            profile_image = "data:" + this.props.user.image.contentType + ";base64," + this.props.user.image.base64;
        }
        return(<div className="col s6">
                    <ul className="right">
                        <li>
                            <Link to="/search"><i className="material-icons">search</i></Link>
                        </li>
                        <li>
                            <Link to="/users/myplaces">My Places</Link>
                        </li>
                        <li>
                            <Link to="/users/listings">Listings</Link>
                        </li>
                        <li>
                            <Link to="/users/me"><img height="55" className="icon hide-on-med-and-down circle"
                                                      src={profile_image}
                                                      alt="profile" style={{"margin": "5px"}}/>
                            </Link>
                        </li>
                        <li>
                            <a href="#" onClick={() => this.props.logout()}>Logout</a>
                        </li>
                    </ul>
                </div>
        );
    }
}

class NavBarSeeker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        let profile_image = default_profile_image;
        if (typeof(this.props.user.image) != "undefined"){
            profile_image = "data:" + this.props.user.image.contentType + ";base64," + this.props.user.image.base64;
        }
        return(
            <div className="col s6">
                <ul className="right">
                    <li>
                        <Link to="/search"><i className="material-icons">search</i></Link>
                    </li>
                    <li>
                        <Link to="/users/myplaces">My Places</Link>
                    </li>
                    <li>
                        <Link to="/users/me"><img height="55" className="icon hide-on-med-and-down circle"
                                                  src={profile_image}
                                                  alt="profile" style={{"margin": "5px"}}/>
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={() => this.props.logout()} >Logout</a>
                    </li>
                </ul>
            </div>
        );
    }
}




{/*
<div className="col s2">
    <img src="https://yt3.ggpht.com/a-/AJLlDp3YlTWoIeLfygzbjlM1LxVLOv4nBHX7LVqW5w=s900-mo-c-c0xffffffff-rj-k-no" alt=""
         className="circle responsive-img" />
</div>*/}

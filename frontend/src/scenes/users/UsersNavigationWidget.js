"use strict";

import React from 'react';
import {Link, withRouter} from "react-router-dom";
import UserService from "../../services/UserService";

class UsersNavigationWidget extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col s2 collection">
                    <div style={{margin:"20px"}} className="footer-copyright"><i className="material-icons">person</i> Profile</div>
                    <Link to="/users/listings" className="collection-item"><i className="material-icons">attach_money</i> Financial ()</Link>
                    <Link to="/users/edit" className="collection-item"><i className="material-icons">map</i> Location ()</Link>
                    <UserPromptInfoDynamic {...this.props} />
            </div>
        );
    }
}


class UserPromptInfoDynamic extends React.Component {

    constructor(props) {
        super(props);
        console.log("UserPromptInfoDynamic, props: ", this.props );
        this.state = {
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined
        }
    }


    componentDidMount(){

        console.log("UserPromptInfoDynamic, componentDidMount");

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
    

    render(){
        console.group("UserPromptInfoDynamic");
        console.log("user render", this.state.user);
        console.groupEnd();

        let u = this.state.user;

        if (!u){
            return (<UserPromptInfoGuest />);
        }

        const host = u.host;
        const seeker = u.seeker;
        if(host === true && seeker === true){
            return (<UserPromptInfoHostSeeker user={this.state.user}  />);
        } else if (host === true){
            return (<UserPromptInfoHost user={this.state.user}  />);
        } else if (seeker === true){
            return (<UserPromptInfoSeeker  user={this.state.user}   />);
        } else {
            return (null);
        }
    }

}




class UserPromptInfoHost extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="card-content">
                Interested in renting space out somewhere else?
                <Link to="/users/becomeSeeker">Become a seeker</Link>
            </div>
        );
    }
}

class UserPromptInfoHostSeeker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(<div className="card-content">
                <i className="material-icons">check</i>Host and Seeker
            </div>
        );
    }
}

class UserPromptInfoSeeker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="card-content">
                Interested in earning money in your spare time?
                        <Link to="/users/becomeHost">Become a host</Link>
            </div>
        );
    }
}



export default withRouter(UsersNavigationWidget);
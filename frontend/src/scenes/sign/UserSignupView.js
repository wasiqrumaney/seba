"use strict";

import React from 'react';

import UserSignup from './UserSignup';

import UserService from '../../services/UserService';


export class UserSignupView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    signup(user) {
        UserService.register(user.email, user.password, user.first_name, user.last_name, user.seeker, user.host).then((data) => {
            this.props.history.push('/');
        }).catch((e) => {
            console.log("signup e: ",e );
            console.error(e);
            this.setState({
                error: e
            });
        })
    }

    render() {
        return (
            <UserSignup onSubmit={(user) => this.signup(user)} error={this.state.error}></UserSignup>
        );
    }
}
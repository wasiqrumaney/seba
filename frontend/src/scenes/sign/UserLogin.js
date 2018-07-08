"use strict";

import React from 'react';
import { Card, Button, TextField } from 'react-md';
import { withRouter, Link } from 'react-router-dom';

import { AlertMessage } from '../../components/common/AlertMessage';
import Page from '../../components/Page';


const style = { maxWidth: 500 };


class UserLogin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : ''
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(event) {
        this.setState(Object.assign({}, this.state, {email: event.target.value}));
    }

    handleChangePassword(event) {
        this.setState(Object.assign({}, this.state, {password: event.target.value}));
    }

    handleSubmit(event) {
        event.preventDefault();

        let user = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.onSubmit(user);
    }

    render() {
        return (
            <Page>
            <div className="container">
                <div className="row">
                    <form className="col s6 offset-s3" onSubmit={this.handleSubmit} >
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">Login</span>
                                <p>Insert your email and your password.</p>


                                <div className="row">
                                    <div className="input-field col s12" >
                                        {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                                        <input value={this.state.email} id="email" type="email" onChange={this.handleChangeEmail}/>
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input value={this.state.password} id="password" type="password"onChange={this.handleChangePassword}/>
                                        <label htmlFor="password">Password</label>
                                    </div>
                                </div>

                                <button className="btn waves-effect waves-light" type="submit" name="action" disabled={this.state.email == undefined || this.state.email == '' || this.state.password == undefined || this.state.password == '' ? true : false} >
                                    Submit
                                </button>

                                <AlertMessage className="md-row md-full-width" >{this.props.error ? `${this.props.error}` : ''}</AlertMessage>

                            </div>

                            <div className="card-action">
                                <Link to={'/register'} className="md-cell">Not registered yet?</Link>
                                {/*<Link to={'#'} className="md-cell">forget password?</Link> */}
                            </div>

                        </div>

                    </form>
                </div>
            </div>
            </Page>
        );
    }
};

export default withRouter(UserLogin);
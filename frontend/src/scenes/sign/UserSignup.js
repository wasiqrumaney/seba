"use strict";

import React from 'react';
import { withRouter } from 'react-router-dom';

import { AlertMessage } from '../../components/common/AlertMessage';
import Page from '../../components/Page';


const style = { maxWidth: 500 };


class UserSignup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            first_name : '',
            last_name : '',
            isSeeker : true,
            isHost : false
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeSeeker = this.handleChangeSeeker.bind(this);
        this.handleChangeHost = this.handleChangeHost.bind(this);
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeLastName = this.handleChangeLastName.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(event) {
        this.setState(Object.assign({}, this.state, {email: event.target.value}));
    }

    handleChangePassword(event) {
        this.setState(Object.assign({}, this.state, {password: event.target.value}));
    }

    handleChangeFirstName(event) {
        this.setState(Object.assign({}, this.state, {first_name: event.target.value}));
    }

    handleChangeLastName(event) {
        this.setState(Object.assign({}, this.state, {last_name: event.target.value}));
    }

    handleChangeSeeker(event) {
        this.setState({
            isSeeker : event.target.checked
        });
        console.log("isSeeker", event.target.checked);
        //this.setState(Object.assign({}, this.state, {password: event.target.value}));
    }

    handleChangeHost(event) {
        this.setState({
            isHost : event.target.checked
        });
        console.log("isHost", event.target.checked);
        //this.setState(Object.assign({}, this.state, {password: event.target.value}));
    }
    handleSubmit(event) {
        event.preventDefault();

        let user = {
            email: this.state.email,
            password: this.state.password,
            seeker: this.state.isSeeker,
            host: this.state.isHost,
            first_name: this.state.first_name,
            last_name: this.state.last_name
        };

        console.log("user to create: ", user);

        this.props.onSubmit(user);
    }

    render() {
        return (
            <Page>
                <div className="container">
                    <div className="row">
                        <form className="col s12" onSubmit={this.handleSubmit} onReset={() => this.props.history.goBack()}>

                            <div className="row">
                                <div className="input-field col s6" >
                                    {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                                    <input value={this.state.email} id="email" type="email" className="validate" onChange={this.handleChangeEmail}/>
                                    <label htmlFor="email">Email</label>
                                    <span className="helper-text" data-error="wrong"
                                          data-success="right">&nbsp;</span>
                                </div>

                                <div className="input-field col s6" >
                                    {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                                    <input value={this.state.password} id="password" type="password" className="validate" onChange={this.handleChangePassword}/>
                                    <label htmlFor="password">Password</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-field col s6" >
                                    {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                                    <input value={this.state.first_name} id="first-name" type="text" className="validate" onChange={this.handleChangeFirstName}/>
                                    <label htmlFor="first-name">First Name</label>
                                </div>

                                <div className="input-field col s6" >
                                    {/*<i className="material-icons prefix" style={{'marginTop' : '10px'}}>title</i> */}
                                    <input value={this.state.last_name} id="last-name" type="text" className="validate" onChange={this.handleChangeLastName}/>
                                    <label htmlFor="last-name">Last Name</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-field col s6" >
                                    <p>
                                    <label>
                                        <input value="true" type="checkbox" id="seeker" className="filled-in" checked={this.state.isSeeker} onChange={this.handleChangeSeeker}  />
                                        <span>I'm looking for a place to leave my bags</span>
                                    </label>
                                    </p>
                                </div>

                                <div className="input-field col s6" >
                                    <p>
                                        <label>
                                            <input value="true" type="checkbox" id="host" className="filled-in" checked={this.state.isHost} onChange={this.handleChangeHost}  />
                                            <span>I have free places and I want to rent it</span>
                                        </label>
                                    </p>
                                </div>
                            </div>

                            <div className="row">
                            <button className="btn waves-effect waves-light" type="submit" name="action" >
                                Register
                            </button>

                            <button className="btn waves-effect waves-light" type="reset" name="action" >
                                Go back
                            </button>
                            </div>

                            <div className="row">
                                <div className="input-field col s12" >
                                <AlertMessage className="md-row md-full-width" >{this.props.error ? `${this.props.error}` : ''}</AlertMessage>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </Page>
        );
    }
};

export default withRouter(UserSignup);
"use strict";

import React from 'react';
import {withRouter} from "react-router-dom";
import Page from "../../components/Page";
import UserService from "../../services/UserService";

class UsersView extends React.Component {

    constructor(props) {
        super(props);

        let u = UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined;
        this.state = {
            user : u
        }
    };

    /* TODO, tutorial : https://codepen.io/Yuschick/post/react-passing-state-to-props-children-in-jsx */
    childWithProp(){
        return React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {user: this.state.user});
        });
    }

    render() {
        return (
            <Page>
                <div className="container">
                        <div className="col s6">
                            {this.props.children}
                        </div>
                </div>
            </Page>
        );
    }
}

export default withRouter(UsersView);
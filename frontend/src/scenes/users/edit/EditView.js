"use strict";

import React from 'react';
import {ListingsView} from '../listings/ListingsView';
import UsersNavigationWidget from "../UsersNavigationWidget";
import Page from "../../../components/Page";
import UsersView from "../UsersView";

class EditView extends React.Component {

    constructor(props) {

        console.log("EditView constructor: ");
        console.log(props);

        super(props);
    }

    render() {
        return (
        <UsersView>
            <div className="card-panel orange lighten-2 z-depth-0">

            </div>
        </UsersView>
        );
    }
}

export default EditView;
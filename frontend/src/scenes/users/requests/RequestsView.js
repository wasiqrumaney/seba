"use strict";

import React from 'react';

import RequestsService from '../../../services/RequestsService';

import { DataTable, TableHeader, TableBody, TableRow, TableColumn, Button, FontIcon } from 'react-md';
import Page from '../../../components/Page'
import UserService from "../../../services/UserService";
import { Link } from 'react-router-dom';

class RequestsView extends React.Component {

    constructor(props) {

        console.log(props);

        super(props);

        this.state = {
            loading: false,
            data: []
        };
    }

    componentWillMount(){
        this.setState({
            loading: true
        });

        RequestsService.getRequests().then((data) => {

            this.setState({
                data: [...data],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }

    deleteRequest(id) {
        // TODO, implementing after DELETE LISTING
        // actually cancels the request, according to what we tell the user.
    }

    render() {
        if (this.state.loading) {
            return (<h2>Loading...</h2>);
        }

        return (
            <Page>
            <Button>Requests</Button>
            <DataTable plain>
                <TableHeader>
                    <TableRow>
                        <TableColumn>_id</TableColumn>
                        <TableColumn>address</TableColumn>
                        <TableColumn>title</TableColumn>
                        <TableColumn>description</TableColumn>
                        <TableColumn>edit</TableColumn>
                        <TableColumn>delete</TableColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.state.data.map((Listing, i) => <ListingsListRow key={i} Listing={Listing} onDelete={(id) => this.deleteListing(id)} />)}
                </TableBody>
            </DataTable>

            <Button onClick={() => this.props.history.push('/users/listings/add')} >Add listing</Button>
            </Page>

        );
    }
}
export default RequestsView;


class ListingsListRow extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <TableRow key={this.props.key}>

                <TableColumn><FontIcon>{this.props.Listing._id}</FontIcon></TableColumn>
                <TableColumn><FontIcon>{this.props.Listing.address.formatted_address}</FontIcon></TableColumn>
                <TableColumn><FontIcon>{this.props.Listing.title}</FontIcon></TableColumn>
                <TableColumn><FontIcon>{this.props.Listing.description}</FontIcon></TableColumn>

                {UserService.isAuthenticated() ?
                    <TableColumn><Link to={`/edit/${this.props.Listing._id}`}><FontIcon>mode_edit</FontIcon></Link></TableColumn>
                    : <TableColumn><Link to={'/login'}><FontIcon>mode_edit</FontIcon></Link></TableColumn>
                }
                {UserService.isAuthenticated() ?
                    <TableColumn><Button onClick={() => this.props.onDelete(this.props.Listing._id)} icon>delete</Button></TableColumn>
                    : <TableColumn><Link to={'/login'}><FontIcon>delete</FontIcon></Link></TableColumn>
                }
            </TableRow>
        );
    }
}
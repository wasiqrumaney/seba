"use strict";

import React from 'react';
import { FontIcon } from 'react-md';
import { Link } from 'react-router-dom';

import { SimpleLink } from '../../components/common/SimpleLink';
import UserService from '../../services/UserService';
import { CardGroup, CardDeck, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

export class SearchListingsListRow extends React.Component {

    constructor(props) {
        super(props);

        console.log("SearchListingsListRow props:", this.props);

    }

    render() {

        let src_image = {}
        if (this.props.listing.image) {
            src_image = "data:" + this.props.listing.image.contentType + ";base64," + this.props.listing.image.data;
        }

        return (

            <Card style={{width:'30%', margin:'15px', border:'1px solid rgba(0,0,0,.125)', borderRadius:'.25rem'}}>
                <CardImg top width="100%" src={src_image} alt="Card image cap" />
                <CardBody>
                    <CardTitle><SimpleLink to={`/show/${this.props.listing._id}`}>{this.props.listing.title}</SimpleLink></CardTitle>
                    <CardSubtitle>{this.props.listing.address.formatted_address}</CardSubtitle>
                    <CardText>
                            <div className="col s12 m6 teal-text">
                                <b>€ {this.props.listing.price}</b> per sqrm per week
                            </div>
                            <div className="col s12 m6 teal-text">
                                <b>{this.props.listing.sqrm}</b> sqrm available
                            </div>
                            {this.props.listing.description}
                    </CardText>
                </CardBody>
            </Card>

        );
    }
}
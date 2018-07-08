"use strict";

import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import UserService from '../../services/UserService';
import RequestService from '../../services/RequestsService';
import ListingService from '../../services/ListingService';
import { Slider, Slide, Modal, Row, Input, Col, Card, CardTitle, CardPanel } from 'react-materialize';
import DatePicker from 'react-datepicker';
import defaultPhoto from '../home/images/detail1.jpg';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { withScriptjs, withGoogleMap, GoogleMap, Marker }from "react-google-maps"

const style = {};

export class SearchListingsDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment(),
            message: '',
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined,
            host: undefined,
            sqrm: 1
        };
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.handleChangeArea = this.handleChangeArea.bind(this);
        this.reserveSpot = this.reserveSpot.bind(this);
    }

    componentDidMount () {
        $('.modal-footer').hide();
        $('.slider').css('height', '500px');
        $('.slides').css('height', '500px');

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

    reserveSpot(event) {
        let request = {
            startDate : this.state.startDate.format("YYYY-MM-DD"),
            endDate : this.state.endDate.format("YYYY-MM-DD"),
            message : this.state.message,
            sqrm : this.state.sqrm,
            listing : this.props.listing._id,
            price: this.props.listing.price
        }

        console.log("reserveSport: requests", request );

        RequestService.createRequest(request).then((request) => {

            console.log("request created, data:", request );
            $('#foo').find('.modal-content').text("Request Sent!");
            $('#foo').modal('open');
            //this.props.history.push('/');
            console.log("My props", this.props);
        }).catch((e) => {
            console.log("Request e: ",e );
            console.error(e);
            let msg = e.split(':');
            $('#foo').find('.modal-content').text(msg[1]);
            $('#foo').modal('open');
            this.setState({
                error: e
            });
        });

    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date
        });
    }
    handleChangeMessage(event) {
        this.setState({
            message: event.target.value
        });
    }

    handleEndDateChange(date) {
        this.setState({
            endDate: date
        });
    }
    handleChangeArea(event) {
        this.setState({
            sqrm: event.target.value
        });
    }

    render() {
        if (this.props.loading){
            return(
                <Page>
                <Slider indicators={false} style={{height: '700px'}}>
                    <Slide src={defaultPhoto}>
                        <div className="row" style={{marginTop: '350px', marginLeft: '-50px'}}>
                            <Modal
                                style={{maxHeight: '110%', width: '800px'}}
                                trigger={<div className="btn">Show Image</div>}>
                                <div>
                                    <img src={defaultPhoto} className="responsive-img" style={{maxHeight: '500px'}}></img>
                                </div>
                            </Modal>
                        </div>
                    </Slide>
                </Slider>
                <div className="section section-icons grey lighten-4">
                    <div className="container">
                        <div className="row">
                            <div className="col s12 m8">
                                <CardPanel className='z-depth-4'>
                                    loading...
                                </CardPanel>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
            );
        }

        console.log("this.props.listing: ", this.props.listing);

        let listingImage = {};
        if (this.props.listing.image) {
            listingImage = "data:" + this.props.listing.image.contentType + ";base64," + this.props.listing.image.data;
        }

        let imageHost = {};
        if(this.props.listing.host.image) {
            imageHost = "data:" + this.props.listing.host.image.contentType + ";base64," + Buffer.from(this.props.listing.host.image.data).toString('base64');
        }

        // TODO REACT CLASS
        console.log("this state user:", this.state.user);

        let modal = "";

        if (!this.state.user) {
            modal = <div className="">
                Interested in that place? <Link to="/login">login</Link> and reserve that spot!
            </div>;
        } else if (this.state.user && this.state.user.host == true && this.state.user.seeker == false) {
            modal = <div className="">
                Want to become a seeker? <Link to="/users/me">become a seeker now</Link>
            </div>;
        } else if (this.state.user && this.state.user.seeker == true ){
            modal = <Modal id="main"
                           style={{height: '400px'}}
                           header='Reserve this spot'
                           trigger={<div className="btn">Reserve this Spot</div>}>
                <div>
                    <Row>
                        <Col s={4}>
                            <DatePicker s={5} selected={this.state.startDate} placeholder="Start Date" onChange={this.handleStartDateChange}/>
                        </Col>
                        <Col s={5}>
                            <DatePicker s={5} selected={this.state.endDate} placeholder="End Date" onChange={this.handleEndDateChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={6}>
                            <Input type="value" value={this.state.sqrm} label="Area Required" s={6} onChange={this.handleChangeArea}/>
                        </Col>
                    </Row>
                    <Row>
                        <Input type="textarea" value={this.state.message} label="Message" s={12} onChange={this.handleChangeMessage}/>
                    </Row>
                </div>
                <div className="btn" id='btnReserve' style={{display: 'none'}} onClick={this.reserveSpot}>Reserve</div>
                <div>
                    <div className="btn" onClick={() => {
                        $('#btnReserve').click();
                        $('#main').modal("close");
                    }}>Reserve</div>
                    <Modal
                        id='foo'>
                        <h5>Your Request has been sent. Please wait for the response.</h5>
                    </Modal>
                </div>
            </Modal>;
        }


        return (
            <Page>
                <Slider indicators={false} style={{height: '700px'}}>
                    <Slide src={listingImage}>
                        <div className="row" style={{marginTop: '350px', marginLeft: '-50px'}}>
                            <Modal
                                style={{maxHeight: '110%', width: '800px'}}
                                trigger={<div className="btn">Show Image</div>}>
                                <div>
                                    <img src={listingImage} className="responsive-img" style={{maxHeight: '500px'}}></img>
                                </div>
                            </Modal>
                        </div>
                    </Slide>
                </Slider>
                <div className="section section-icons grey lighten-4">
                    <div className="container">
                        <div className="row">
                            <div className="col s12 m8">
                                <CardPanel className='z-depth-4'>
                                    <div className="row">
                                        <div className="col s12 m8">
                                            <h5>{this.props.listing.title}</h5>
                                        </div>
                                    </div>

                                    <h6><i className="material-icons small teal-text text-darken-1">room</i>{this.props.listing.address.formatted_address}</h6>

                                    <GoogleMapComponent
                                        lat={this.props.listing.address.lat}
                                        lng={this.props.listing.address.lng}
                                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAHROnNVOwSIzk-keS7E1CjYqRVHur89KM"
                                        loadingElement={<div style={{ height: `100%` }} />}
                                        containerElement={<div style={{ height: `400px` }} />}
                                        mapElement={<div style={{ height: `100%` }} />}
                                    />

                                    <p>{this.props.listing.description}</p>
                                </CardPanel>
                            </div>
                            <div className="col s12 m4 center">

                                <CardPanel className='z-depth-4'>
                                    <div>
                                        <img src={imageHost} alt="" className="responsive-img circle"/>
                                    </div>
                                    <h6>
                                        <Link to={"/users/public/" + this.props.listing.host._id}>{this.props.listing.host.name.first + " " + this.props.listing.host.name.last}</Link>
                                    </h6>
                                </CardPanel>

                                <CardPanel className='z-depth-4'>
                                    <div className="row">
                                        <h6><b>$ {this.props.listing.price}</b> per sqrm per week</h6>
                                    </div>
                                    <div className="row">
                                        <h6><b>{this.props.listing.sqrm}</b> sqrm space available</h6>
                                    </div>
                                        {modal}
                                </CardPanel>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}



const GoogleMapComponent =  withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
    >
        <Marker position={{ lat : props.lat, lng: props.lng }} />
    </GoogleMap>
))
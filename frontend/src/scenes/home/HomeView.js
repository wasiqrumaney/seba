"use strict";

import React from 'react';
import style2 from './HomeView.css'
import Typed from 'typed.js';
import Page from "../../components/Page";
import style from './SearchBar.css'
import munich1 from './images/munich4.jpg';
import person1 from './images/person1.jpg';
import person2 from './images/person2.jpg';
import ListingService from "../../services/ListingService";
import RequestsService from "../../services/RequestsService";
import {Link} from "react-router-dom";
import {Slider, Slide, Card, CardTitle, CardPanel, Input } from 'react-materialize';
import { SearchListingsList } from '../search/SearchListingsList';
import {SearchListingsListRow} from "../search/SearchListingsListRow";
import { SimpleLink } from '../../components/common/SimpleLink';

export class HomeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        };

        this.handleChangeSearch = this.handleChangeSearch.bind(this)
    }
    componentWillMount(){
        this.setState({
            loading: true
        });
        ListingService.getLastListings().then((data) => {

            this.setState({
                data: [...data],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }

    componentDidMount(){
        $('.slider').css('height','600px');
        $('.slides').css('height','600px');
    }

    handleChangeSearch(event) {
        this.setState(Object.assign({}, this.state, {search: event.target.value}));
    }
    render() {
        return (
            <Page>
                <Slider indicators={false} style={{height: '700px'}}>
                    <Slide src={munich1} placement="left">
                        <div className="row">
                            <div className="col s12 m6">
                                <h4 style={{color: 'white'}}>
                                    An easy and reliable way to find a temporary storage area
                                </h4>
                            </div>
                            <div className="col s12 m1">
                            </div>
                            <div className="col s12 m5">
                                <CardPanel>
                                    <input type="text" value={this.state.search} placeholder={"Search by location"} onChange={this.handleChangeSearch}></input>
                                    <div className="btn"><Link to={{pathname: '/search', search : this.state.search}} style={{color: 'white'}}> Search </Link></div>
                                </CardPanel>
                            </div>
                        </div>
                    </Slide>
                </Slider>
                <div className="section section-icons grey lighten-4 center">
                    <div className="container">
                        <div className="row">
                            <div className="col s12 m4">
                                <CardPanel className='z-depth-4'>
                                    <i className="material-icons large teal-text text-darken-1">room</i>
                                    <h5>Easy Location</h5>
                                    <p>Find a local place for your belongings with one of our trusted hosts, often just
                                        2 minutes away!</p>
                                </CardPanel>
                            </div>
                            <div className="col s12 m4">
                                <CardPanel className='z-depth-4'>
                                    <i className="material-icons large teal-text text-darken-1">fingerprint</i>
                                    <h5>Trusted Service</h5>
                                    <p>Our network of hosts are verified in person, giving you full confidence in the
                                        security of your belongings at all times</p>
                                </CardPanel>
                            </div>
                            <div className="col s12 m4">
                                <CardPanel className='z-depth-4'>
                                    <i className="material-icons large teal-text text-darken-1">attach_money</i>
                                    <h5>Cost effective and flexible</h5>
                                    <p>Buying by Sqrm means saving by sqrm! You pay for <b>exactly</b> what you use,
                                        saving you up to 60% compared to renting storage garages! </p>
                                </CardPanel>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="how">
                    <div className="how-question ">How does store4Me work?
                    <div className="how-icon"><i className="material-icons">aspect_ratio</i></div>
                    </div>
                    <div className="how-step row">
                        <div className="how-step-left col s6 valign-wrapper">
                            <div className="container-wide">
                                <div className="how-step-content">
                                    <h4 className="how-step-title"> <i className="large material-icons">search</i> 1. Search for storage
                                        space</h4>
                                    <div className="how-step-description">With options to select Sqrm required, and the
                                        dates that you need the storage space, you can be sure to find storage exactly
                                        where you need it! <Link to="/search" className="btn ">Browse listings now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="how-step row">
                        <div className="how-step-right col offset-s6 s5 no-right-padding valign">
                            <div className="container-wide offset-s1">
                                <div className="how-step-content">
                                    <h4 className="how-step-title"><i className="large material-icons">dashboard</i> 2.
                                        Choose a listing +<br /><b>request</b> your booking</h4>
                                    <div className="how-step-description">It takes just two clicks to request storage space
                                        for the dates and sqrm selected.
                                        <br/> <i className="material-icons tiny">airline_seat_recline_extra</i>
                                        Go ahead, relax, sit back and wait for the prompt
                                        reply of the host of the storage space!

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="how-step row">
                        <div className="how-step-left col s6 valign-wrapper how-step-left-last">
                            <div className="container-wide">
                                <div className="how-step-content">
                                    <h4 className="how-step-title"><i
                                                                      className="material-icons large">notifications_active</i> 3. Receive
                                        host confirmation/rejection</h4>
                                    <div className="how-step-description">Once the host accepts your request, you are
                                        ready to go! Wait until the first day and deposit the belongings. Then it is
                                        just a matter of paying for the space, and then collecting the belongings!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="how-icon how-end-icon"><i className="material-icons">done</i></div>
                    <div className="how-end-title">Time to explore the world!</div>
                    <div className="how-end-cta center-align"><Link to="/register" className="modal-trigger btn btn-large waves-effect waves-light sign-up-btn">Register now!</Link></div>
                    <div style={{height:"30px"}}></div>
                </div>
                <div className="section section-icons teal darken-1 center white-text">
                    <div className="row container">
                        <h3 className="header">Recently Added Listings</h3>
                        <div className="row">
                            {
                                this.state.data.map((listing, i) => {

                                let img_src = {};
                                if (listing.image){
                                    img_src = "data:" + listing.image.contentType + ";base64," + listing.image.data;
                                };

                                <div className="col s12 m4">
                                    <Card key={i} Listing={listing}
                                          header={<CardTitle reveal image={img_src} waves='light'/>}
                                          title={<SimpleLink to={`/show/${listing._id}`}>{listing.title}</SimpleLink>}
                                          subtitle={listing.address.formatted_address}
                                          reveal={<p>{listing.description}</p>}>
                                    </Card>
                                </div>
                            })
                            }
                        </div>
                    </div>
                </div>
                    <div className="testimonials container-wide section section-icons white center">
                        <div className="row">
                            <div className="col l6 testimionals-testimional">
                                <div className="col l3">
                                    <img src={person2} alt=""
                                         className="circle responsive-img profileImage" />
                                </div>
                                <div className="col l9">
                                    <div className="testimionals-content">It was so easy to get started! I only had to
                                        select the sqrm, set reasonable dates, and found that my request was almost
                                        immediately answered! Top experience!
                                    </div>
                                    <div className="testimionals-author">Jordan C., Seeker user</div>
                                </div>
                            </div>
                            <div className="col l6 testimionals-testimional">
                                <div className="col l3">
                                    <img src={person1} alt=""
                                         className="circle responsive-img profileImage"  />
                                </div>
                                <div className="col l9">
                                    <div className="testimionals-content">This is a fantastic site to connect people
                                        without space with those who want to offer it! It bridges the gap by offering
                                        ease of use and allowing both affordable prices for seekers and a very good
                                        income source for hosts like me!
                                    </div>
                                    <div className="testimionals-author">Tony P, Host user in Munich</div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="section section-icons grey lighten-4 center">
                    <h4>Proceed to Search</h4>
                    <div className="btn"><Link to={{pathname: '/search', search : ''}} style={{color: 'white'}}> Search </Link></div>
                </div>
            </Page>
        );
    }
}

export default HomeView;
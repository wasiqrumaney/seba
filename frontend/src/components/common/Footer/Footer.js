"use strict";

import React from 'react';
import Styled from 'styled-components';
import { Link } from 'react-router-dom';


class PlainFooter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="page-footer">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="grey-text">What's this?</h5>
                            <p className="grey-text text-lighten-4">We are team 56 of the SEBA module at the
                                <a target="_blank" href="https://www.tum.de"> Technical University of Munich
                                    <i className="material-icons tiny">open_in_new</i>
                                </a><br />
                            This is our demo application StoreIt4Me, which runs using React on nodeJS. <br /> <br />
                                <b>Languages</b>: Javascript, HTML, CSS<br />
                                <b>Database</b>: MongoDB, Schema: Mongoose<br />
                                <b>Design</b>: Materialize CSS, including javascript components<br /><br />
                                <i className="material-icons">copyright</i> Copyright 2018, SEBA Team 56
                            </p>


                        </div>
                        <div className="col l6 s12">
                            <h5 className="grey-text">About</h5>
                            <ul className="grey-text text-lighten-4" style={{"listStyle": "none"}}>
                                <li className="browser-default">We developed this solution implementing filtering, mapping and recent programming design patterns</li>
                                <li>For example, resize your screen (mobile vs. desktop), and watch this footer react to your screen size!</li>
                                <li>We used git hosted on bitbucket to manage our version control, which you can view below, if access is granted:</li>
                                <li><a target="_blank" href="https://bitbucket.org/jonathanbesomi/seba"> <i
                                    className="material-icons">code</i>Our Repository </a></li>

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        <i className="material-icons" style={{color:"red"}}>favorite</i> <i className="material-icons">person_pin_circle</i> Made with love in Munich
                    </div>
                </div>
            </footer>
        );
    }
}

export const Footer = Styled(PlainFooter)`

`;
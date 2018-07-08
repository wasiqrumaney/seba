"use strict";

import React from 'react';

import Header from './common/Header';
import { Footer } from './common/Footer/Footer';

require('../sass/materialize.scss');

export default class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }
    }

    componentDidMount(){
       this.setState({
           title: document.title
       });
    }

    render() {
        return (
            <section>
                <Header title={this.state.title} />
                {this.props.children}
                <Footer />
            </section>
        );
    }
}
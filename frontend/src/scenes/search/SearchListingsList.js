"use strict";

import React from 'react';
//import { DataTable, TableHeader, TableBody, TableRow, TableColumn, Button } from 'react-md';
import Page from '../../components/Page'
import {SearchListingsListRow} from "./SearchListingsListRow";
import UserService from "../../services/UserService";
import { CardDeck } from 'reactstrap';

export const SearchListingsList = ({data, onDelete}) => (
    <CardDeck style={{display: 'flex', flexWrap: 'wrap'}}>
        {data.map((listing, i) => <SearchListingsListRow key={i} listing={listing} onDelete={(id) => onDelete(id)} />)}
    </CardDeck>

);


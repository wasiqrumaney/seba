"use strict";

import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import UsersView from "../UsersView";
import munich3 from "../../home/images/munich3.jpg"
import ListingService from "../../../services/ListingService";
import UserService from "../../../services/UserService";
import ContractService from "../../../services/ContractService";
import {AlertMessage} from "../../../components/common/AlertMessage";
import style from "./MyPlacesView.css";
import StatusYes from "../../../components/common/Display/StatusYes";
import StatusNo from "../../../components/common/Display/StatusNo";

class MyPlacesView extends React.Component {

    constructor(props) {
        super(props);

        console.log("MyPlacesView props: ", this.props );

        let u = UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined;
        this.state = {
            user : u
        }
    }

    componentDidMount() {
        console.log("before");
        $(document).ready(function() {
            console.log("viewEditRequest - mounting");
            $('#yourPlacesMenu').tabs();
            $('.tabs').tabs();
            console.log("done");
            console.log($("#yourPlacesMenu"));
        });


    }

    render() {
        return (
            <UsersView>
                <div className="col s12">
                    <div className="card">
                        <div className="card-image" style={{height:"180px", maxHeight:"180px", overflow:"hidden"}}>
                            <img src={munich3} style={{"top": "-45%"}} />
                            <h2 className="card-title">My places</h2>
                        </div>
                        <div className="card-content row s12">
                            <div className="row">
                                <div className="col s3">
                                    <ul id="yourPlacesMenu" className="tabs verticalTabs teal">
                                        <li className="tab verticalTab col s4 btn">
                                            <a className="active" href="#pending">
                                                <i className="material-icons">change_history</i>Pending
                                            </a>
                                        </li>
                                        <li className="tab verticalTab col s4 btn">
                                            <a href="#active" >
                                                <i className="material-icons">check_circle</i>Contracts
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col s9" id="pending"><PendingPlacesTab user={this.state.user} /></div>
                                <div className="col s9" id="active"><ActivePlacesTab user={this.state.user}  /></div>

                                {/*
                                <div className="col s9" id="past"><PastPlacesTab user={this.state.user} /></div>
                                */ }

                            </div>
                        </div>

                    </div>
                </div>
            </UsersView>
        );
    }
}


export default withRouter(MyPlacesView);

class MyPlacesTab extends React.Component {
    // TODO: Tab id not being set correctly
    render() {
        console.log(this);
        console.log(this.props.children);
        console.log("Tab id rendering:" + this.props.id);
        return(
        <div className="col s11 section section-icons grey lighten-4 center card-panel z-depth-4" style={{minHeight:"600px", margin:"10px", overflow:"auto"}}>
            {this.props.children}
        </div>
        );
    }
}

export class PendingPlacesTab extends MyPlacesTab {

    constructor(props) {
        super(props);
        console.log("pending props")
        console.log(...props)
    }

    componentWillMount(){

        this.setState({
            loading: true
        });

        UserService.getPendingRequests().then((data) => {

            console.log("UserService.getPendingRequests data:", data);

            this.setState({
                pendingRequests: [...data],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }


    // TO DO: Load pending requests
    render() {

        console.log("now render requests! pendingRequests:", this.state.pendingRequests);

        if (this.state.loading){
            return("loading");
        }
        console.log("pending requests:");
        console.log(this.state.pendingRequests);
        return(
            <MyPlacesTab>
                <h2>Pending Requests <a href="#!" className="collection-item"><span className="new badge">{this.state.pendingRequests.length}</span></a></h2>


                <table>
                    <thead>
                    <tr>
                        <th>Listing</th>
                        <th>Duration</th>
                        <th>Your Message</th>
                        <th>Sqrm and Cost</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.state.pendingRequests.map((request, i) => <RequestInformationRow key={i} request={{request}} onDelete={(id) => this.deleteRequest(id)} />)}
                    </tbody>
                </table>
            </MyPlacesTab>

        );
    }
}

export class ActivePlacesTab extends MyPlacesTab {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.setState({
            loading: true,
            error : ""
        });

        UserService.getActiveContracts().then((data) => {

            console.log("UserService.getActiveContracts() data:", data);

            this.setState({
                activeContracts: [...data],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }

    callService(action, contract_id){

        if (action == "deposited") {
            ContractService.confirmDeposit(contract_id).then((data) => {
                console.log("deposited correctly: ", data);
                return UserService.getActiveContracts();
            }).then((data) => {

                this.setState({
                    activeContracts: [...data],
                });
            }).catch((e) => {
                console.error(e);
            });
        }

        else if (action == "pickedup") {
            ContractService.confirmPickUp(contract_id).then((data) => {
                console.log("pickedup correctly: ", data);
                return UserService.getActiveContracts();
            }).then((data) => {
                this.setState({
                    activeContracts: [...data],
                });
            }).catch((e) => {
                console.error(e);
            });
        }

        else if (action == "pay") {
            ContractService.confirmPickUp(contract_id).then((data) => {
                console.log("deposited correctly: ", data);
                return UserService.getActiveContracts();
            }).then((data) => {

                this.setState({
                    activeContracts: [...data],
                });
            }).catch((e) => {
                console.error(e);
            });
        }
    }

    payService(contract_id, amount){
        console.log("payService:", contract_id, amount );
        ContractService.payContract(contract_id, amount).then((data) => {
            console.log("payService correctly: ", data);
            return UserService.getActiveContracts();
        }).then((data) => {
            this.setState({
                activeContracts: [...data],
            });
        }).catch((e) => {
            console.error(e);

            this.setState({
                error: "Payment denied."
                }
            )
        });
    }

    render() {

        console.log("now render requests! activeContracts:", this.state.activeContracts);

        if (this.state.loading){
            return(<i className="material-icons">loading</i> );
        }

        return(
            <MyPlacesTab>
                <h2>contracts</h2>
                {this.state.activeContracts.map((contract, i) => <ActiveContractInformationRow key={i} contract={contract} onAction={(action, cid) => this.callService(action,cid)} onPay={(cid,amount) => this.payService(cid,amount)} error={this.state.error} />)}

            </MyPlacesTab>
        );
    }
}



class RequestInformationRow extends MyPlacesTab {

    constructor(props){
        super(props);
        console.log("RequestInformationRow props: ", this.props );
    }


    render(){
        // use to adapt if needed: const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const startDate = new Date(this.props.request.request.startDate).toLocaleDateString("en-UK");
        const endDate = new Date(this.props.request.request.endDate).toLocaleDateString("en-US");
        return(
            <tr>
                <td><Link to={"listings/" + this.props.request.request.listing.id} >listing image, listing title here</Link><br />
                Host:  <a href={"/profile/" + this.props.request.request.host} >first last</a>
                </td>
                <td>{startDate} -<br />
                    {endDate}</td>
                <td><blockquote style={{borderLeft: "5px solid #00897b"}}>{this.props.request.request.message}</blockquote></td>
                <td><i className="material-icons">attach_money</i>{this.props.request.request.price} per week<br />
                    <i className="material-icons">aspect_ratio</i>{this.props.request.request.sqrm} Sqrm</td>

                {/*<td><RequestRowActions {...this.props} /></td> */}
            </tr>
        );
    }
}

class ActiveContractInformationRow extends MyPlacesTab {

    constructor(props){
        super(props);
        console.log("ActiveContractInformationRow props: ", this.props );

        this.state = {
            amountToPay : '',
            hasError: false,
            loading: true,
            pay_button : "pay",
            user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined
        };

        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleChangeAction = this.handleChangeAction.bind(this);
        this.handlePay = this.handlePay.bind(this);
    }

    componentDidMount(){
        this.updateMessageAndAction();

        UserService.me().then((data) => {
            this.setState({
                user: data
            });
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: e
            });
        });
    }

    updateMessageAndAction(){
        console.log("updateMessageAndAction", this.props);
        let message = "";
        let action = "";
        let action_message = "";
        let notification = "";
        if (!this.props.contract.depositedSeeker){
            message = "You still need to deposit your bag";
            notification = "";
            action = "deposited";
            action_message = <span><i className='material-icons'>check</i> Confirm Deposit</span>;
        } else if (this.props.contract.depositedSeeker && !this.props.contract.depositedHost){
            message = "You have deposited your bag. Wait for host confirmation";
            notification = "";
            action = "";
            action_message = ""
        } else if (this.props.contract.depositedSeeker &&
            this.props.contract.depositedHost
            && !this.props.contract.pickedUpSeeker){
            message = "You still need to pick up your bags.";
            notification = "";
            action = "pickedup";
            action_message = <span><i className='material-icons'>check</i> Confirm PickUp</span>;
        } else if (this.props.contract.depositedSeeker &&
            this.props.contract.depositedHost
            && this.props.contract.pickedUpSeeker && !this.props.contract.pickedUpHost){
            message = "You have picked up your bag. Wait for host confirmation";
            notification = "";
            action = "";
        } else {
            message = "Contract ended.";
            notification = "";
            action = "";
        }

        this.setState({
            status : message,
            action : action,
            action_message : action_message,
            loading : false,
            pay_button : "pay"
        });

        UserService.me().then((data) => {
            this.setState({
                user: data
            });
        })

    }


    componentDidUpdate(prevProps) {
            if (this.props.contract !== prevProps.contract || this.props.error !== prevProps.error) {
                this.updateMessageAndAction();
            }
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
    }

    handleChangeAmount(event) {
        this.setState(Object.assign({}, this.state, {amountToPay: event.target.value}));
    }

    handlePay(){
        if (parseInt(this.state.amountToPay) > 0){
            this.setState(Object.assign({}, this.state, {pay_button: "wait a moment..."}));
            this.props.onPay(this.props.contract._id, this.state.amountToPay);
        }
    }

    handleChangeAction(event) {
        this.props.onAction(this.state.action, this.props.contract._id);
        this.setState({
            action_message : "wait a moment...",
        });
    }

    componentWillMount(){
    }


    payment(){

        if ( parseInt(this.props.contract.balanceRemaining) > 0 ){
               return (
            <div className="row">

                <Balance balance={this.state.user.balance} />

                <div className="col s4" >
                    <span>Amount due to pay / Total: <i className="material-icons">attach_money</i> {this.props.contract.balanceRemaining} / {this.props.contract.balanceTotal}</span>
                </div>

                <div className="input-field col s4" >
                    <input value={this.state.amountToPay} id={"amount-"+this.props.contract._id} type="text" className="validate" onChange={this.handleChangeAmount} />
                    <label htmlFor={"amount-"+this.props.contract._id} >Amount</label>
                </div>

                <div className="input-field col s4" >
                    <button className="btn-small waves-effect waves-light" type="submit" name="action" onClick={this.handlePay}  >
                        {this.state.pay_button}
                    </button>

                    <span style={{"marginLeft":"5px", "color":"red"}}>{this.props.error}</span>

                </div>

            </div>);
            }
        else return ('');
    }

    action(){
        if (this.state.action != "" ){
            return (
            <div className="col s12" onClick={this.handleChangeAction} >
                {this.state.status}
                <span className="btn-small">{this.state.action_message}</span>
            </div>
            );
        }
        else {
            return (
                <span className="col s12">{this.state.status}</span>);
        }
    }


    render() {

        if (this.state.loading) {
            return("loading...");
        }
        else if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return(
            <div className="card grey lighten-5">
                <div className="card-content">

                    <span className="card-title">{this.props.contract.listing.title}</span>

                    <div className="section">
                        <span className="col s12">Owner: <Link to={"/users/public/" + this.props.contract.host._id}> {this.props.contract.host.name.first}</Link></span>
                        <span className="col s12">Email: {this.props.contract.host.email}</span>

                    </div>

                    <div className="section">
                        {this.action()}
                    </div>
                    <div className="section">
                        {this.payment()}
                    </div>

                </div>
            </div>
        );

    }
}

const Balance = (props) =>
    <div className="row">
        <div className="col s12" >
            Personal balance: <span style={{"fontWeight": "bold"}} > {props.balance} $</span>
        </div>
        <div className="col s12" >
            You can add credits to your balance from your <Link to="/users/me"> profile settings</Link>
        </div>
    </div>;

/* Since is not a use-case, not implemented yet */
export class PastPlacesTab extends MyPlacesTab {
    constructor(props) {
        super(props);
    }

    componentWillMount(){

        this.setState({
            loading: true
        });

        UserService.getPastContracts().then((data) => {

            console.log("UserService.getPastContracts() data:", data);
            const bothData = [...data]
            this.setState({
                requests: bothData[0],
                contracts: bothData[1],
                loading: false
            });

        }).catch((e) => {
            console.error(e);
        });
    }
    render() {
        if (this.state.loading) {
            return(<div className="valign-wrapper loadRoot s12">
                <div className="preloader-wrapper small active ">
                    <div className="spinner-layer spinner-green-only center-align">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            </div>);
        }

        this.requests = "You have no past requests";
        if (this.state.requests.length !== 0) {
            this.requests = this.state.requests.map((pastRequest, i) => <PastRequestInformationRow key={i} pastRequest={pastRequest}  />)
        }

        this.contracts = "You have no past contracts";
        if (this.state.requests.length !== 0) {
            this.state.contracts.map((pastContract, i) => <PastContractInformationRow key={i} pastContract={pastContract}  />)
        }

        return(
            <MyPlacesTab>
                <h3>Contracts</h3>
                <div className="card">
                    {this.contracts}
                </div>
                <br />
                <h3>Past Requests</h3>
                <div className="card">
                    {this.requests}
                </div>
            </MyPlacesTab>
        );
    }
}
class PastContractInformationRow extends MyPlacesTab {
    constructor(props) {
        super(props);
        console.log("PastContractInformationRow props: ", this.props);

    }
    componentWillMount() {
            this.setState({
                hasError: false
            });
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return(
            <div className="card shadow-5">
                Past Contract: Number
            </div>
        );
    }
}
class PastRequestInformationRow extends MyPlacesTab {
    constructor(props) {
        super(props);
        console.log("PastContractInformationRow props: ", this.props);

    }
    componentWillMount() {
        this.setState({
            hasError: false
        });
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return(
            <div className="card shadow-5">
                Past Request: Number
            </div>
        );
    }
}
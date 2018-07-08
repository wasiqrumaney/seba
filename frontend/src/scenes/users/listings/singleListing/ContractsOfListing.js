"use strict";

import React from "react";
import ListingService from "../../../../services/ListingService";
import {Link, withRouter} from "react-router-dom"
import UserService from "../../../../services/UserService";
import ContractService from "../../../../services/ContractService";
import StatusYes from "../../../../components/common/Display/StatusYes";
import StatusNo from "../../../../components/common/Display/StatusNo";


class ContractsOfListing extends React.Component {

    constructor(props) {
        super(props);
        console.log("ContractsOfListing constructor: ", this.props );

        this.state = {
            loading : true,
            error: undefined
        }

    }


    componentWillMount(){
        if(this.props.location.state && this.props.location.state.listing) {

            console.group("componentWillMount : IF STATE", this.props.location.state.listing );

            ListingService.getContractsForListing(this.props.location.state.listing).then((data) => {
                this.setState({
                    listing: this.props.location.state.listing,
                    contracts: data,
                    loading: false,
                    error: undefined
                });
            }).catch((e) => {
                console.error(e);
            });

            //console.log(this.state.listing.title);
            console.groupEnd();
        }
        else {
            let id = this.props.match.params.id;

            console.log("id:" + id);

            if (id){
                ListingService.getListing(id).then((listing) => {
                    ListingService.getContractsForListing(listing).then((data) => {
                        this.setState({
                            listing: this.state.listing,
                            contracts: data,
                            loading: false,
                            error: undefined
                        });
                    }).catch((e) => {
                        console.error(e);
                    });
                });
            }
            else {
                console.log("NO ID!")
            }
        }
    }

    componentWillReceiveProps(nextProps){
        console.log("Will get props..");
        let id = nextProps.match.params.id;
        console.group("componentWillReceiveProps");
        console.log("nextProps",nextProps);
        console.log("id", id);
        console.log("Contracts!")
        if (id && nextProps.location.state) {
            ListingService.getContractsForListing(nextProps.location.state.listing).then((data) => {
                console.log("getContractsOfListing(id) data:", data);
                this.setState({
                    contracts: data,
                    loading: false,
                    error: undefined
                });
                console.log("Contracts returned:", this.state.contracts);
            }).catch((e) => {
                console.error(e);
                this.setState({
                    contracts: undefined,
                    loading: true,
                    error: e
                });
            });
        }
        console.groupEnd();

    }


    render() {

        if (this.state.loading) {
            return (<div className="card">
                    <div className="card-content">
                        <div className="row">
                            You do not own this listing!
                        </div>
                    </div>
                </div>
            );

        }

        console.log(this.state.contracts);
        if (this.state.contracts.length === 0) {
            return (<div className="card">
                <div className="card-content">
                    <div className="row">
                        <i className="material-icons">information</i><h6> No contracts exist for this listing</h6>
                    </div>
                </div>

                </div>
                        );
        }
        else {
            return (
                <div className="card">
                    <div className="card-content">
                        <div className="row">
                            {
                                this.state.contracts.map((contract, i) => <ContractsListRow key={i} contract={contract}/>)
                            }
                        </div>
                    </div>

                </div>
            );
        }
    }
}

export default withRouter(ContractsOfListing);




class ContractsListRow extends React.Component {

    constructor(props) {

        super(props);

        this.state = { status: this.props.contract.status };

    }

    render() {
        const color = ((status) => {
            switch(status) {
                case "active":
                    return "blue lighten-5";
                case "cancelled":
                    return "red lighten-5";
                case "complete":
                    return "green lighten-5";
                default:
                    return "white";
            }})(this.state.status);

        console.log("ContractsListRow this.props.contract: ", this.props.contract);

        const startDate = new Date(this.props.contract.request.startDate).toLocaleDateString("en-US");
        const endDate = new Date(this.props.contract.request.endDate).toLocaleDateString("en-US");

        return (
            <div className={color + " card"}>
                <div className="card-content row">
                        <div className="col l6 s12">
                            <div className="row s12 m6 "><h5>Contract with: <Link to={"/users/public/" + this.props.contract.seeker._id}>{this.props.contract.seeker.name.first}</Link></h5>

                            <b>Contract Duration</b><br />
                            {startDate} - {endDate}
                        </div>
                        <div className="row s12 m6 large">

                            <div className="col s12">
                                Balance still due from seeker(remaining / total):
                            </div>

                            <div className="col s12">
                                <i className="material-icons">attach_money</i><span style={{fontSize:"1.4rm"}}> {this.props.contract.balanceRemaining} / {this.props.contract.balanceTotal} </span>
                            </div>
                        </div>
                        </div>
                        <div className="col l6 s12">
                        <ContractRowActions {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}


class ContractRowActions extends React.Component {

    constructor(props) {
        super(props);

    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    componentDidUpdate(prevProps) {
        console.log("Update 1");
        if (this.props.contract !== prevProps.contract) {
            this.setState(this.state);
        }
    }

    componentWillMount() {
        console.log("will mount!");
    }



    render() {


        return (
            <span>
                <h5>Deposited status</h5>
                <ContractRowDepositStatus {...this.props} forSeeker={true} /><br />
                <ContractRowDepositStatus {...this.props}  />
                <h5>Pick up status</h5>
                <ContractRowPickUpStatus {...this.props} forSeeker={true} /><br />
                <ContractRowPickUpStatus {...this.props}  />
            </span>
        );
    }
}

class ContractRowDepositStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contract: this.props.contract
        };

        this.handleHostDeposit = this.handleHostDeposit.bind(this);
        this.callService = this.callService.bind(this);
    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    componentDidUpdate(prevProps) {
        console.log("Update 1");
        if (this.props.contract !== prevProps.contract) {
            this.setState(this.state);
        }
    }

    componentWillMount() {
        console.log("will mount!");
    }


    callService(action, contract_id){

        if (action == "deposit") {
            ContractService.confirmDeposit(contract_id).then((data) => {
                console.log("this is:", this);
                this.setState({
                    contract: data
                });
                console.log("after");
            }).catch((e) => {
                console.log("error state:");
                console.error(e);
            })
        }

    }


    handleHostDeposit() {
        this.callService("deposit", this.state.contract._id)

    }

    render() {
        if (this.state.contract.depositedSeeker && this.props.forSeeker == true) {
            return(<span>Seeker <StatusYes /></span>);

        } else if (this.props.forSeeker == true) {
            return(<span>Seeker: <StatusNo /> <br /><i>Not yet deposited</i> </span>);

        }
        else if (this.state.contract.depositedHost) {
            return(<span>You: <StatusYes /></span>);

        } else  {
            return(<span>You: <StatusNo /> <br /><i>Not yet deposited</i> <button className="btn-small" type="submit"
            name="action" onClick={this.handleHostDeposit}><i className="material-icons">check</i> Confirm Deposit</button>
            </span>);
        }
    }
}

class ContractRowPickUpStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: this.props.contract
        };

        this.handleHostPickup = this.handleHostPickup.bind(this);
        this.callService = this.callService.bind(this);
    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    componentDidUpdate(prevProps) {
        console.log("Update 1");
        if (this.props.contract !== prevProps.contract) {
            this.setState(this.state);
        }
    }

    componentWillMount() {
        console.log("will mount!");
    }


    callService(action, contract_id){

        if (action == "pickup") {
            console.log("picking up");
            ContractService.confirmPickUp(contract_id).then((data) => {
                this.setState({
                    contract: data
                });
            }).catch((e) => {
                console.log("error state:");
                console.error(e);
            })
        }
    }

    handleHostPickup(){
        this.callService("pickup", this.state.contract._id)
    }


    render() {
        if (this.state.contract.depositedSeeker && this.state.contract.depositedHost) {
            if (this.state.contract.pickedUpSeeker && this.props.forSeeker == true) {
                return (<span>Seeker <StatusYes/></span>);

            } else if (this.props.forSeeker == true) {
                return (<span>Seeker: <StatusNo/> <br/><i>Not yet picked up</i> </span>);

            }
            else if (this.state.contract.pickedUpHost) {
                return (<span>You: <StatusYes/></span>);

            } else {
                return (<span>You: <StatusNo/> <br/><i>Not yet picked up</i> <button className="btn-small" type="submit"
                name="action" onClick={this.handleHostPickup}><i className="material-icons">check</i> Confirm Pick up</button>
                </span>);
            }
        }
        else if (this.props.forSeeker != true) {
            // still on deposit phase, so do not shown them pick up yet
            return (<span className="grey-text lighten-2">Until the bags are deposited, they cannot be picked up</span>);
        }

        return (<span className="grey-text lighten-2"></span>)
    }
}


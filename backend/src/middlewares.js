"use strict";

const RequestModel = require('./models/request');
const ContractModel = require('./models/contract');
const ListingModel = require('./models/listing');

const jwt    = require('jsonwebtoken');

const config = require ('./config');

const allowCrossDomain = (req, res, next) => {
    const allowedHeaders =
        ["x-access-token",
            "Accept",
            "Accept-CH",
            "Accept-Charset",
            "Accept-Datetime",
            "Accept-Encoding", "" + "Accept-Ext",
            "Accept-Features",
            "Accept-Language",
            "Accept-Params",
            "Accept-Ranges",
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Origin",
            "Access-Control-Expose-Headers",
            "Access-Control-Max-Age",
            "Access-Control-Request-Headers",
            "Access-Control-Request-Method",
            "Age", "Allow", "Alternates", "Authentication-Info", "Authorization", "C-Ext", "C-Man", "C-Opt", "C-PEP", "C-PEP-Info", "CONNECT", "Cache-Control", "Compliance", "Connection", "Content-Base", "Content-Disposition", "Content-Encoding", "Content-ID", "Content-Language", "Content-Length", "Content-Location", "Content-MD5", "Content-Range", "Content-Script-Type", "Content-Security-Policy", "Content-Style-Type", "Content-Transfer-Encoding", "Content-Type", "Content-Version", "Cookie", "Cost", "DAV", "DELETE", "DNT", "DPR", "Date", "Default-Style", "Delta-Base", "Depth", "Derived-From", "Destination", "Differential-ID", "Digest", "ETag", "Expect", "Expires", "Ext", "From", "GET", "GetProfile", "HEAD", "HTTP-date", "Host", "IM", "If", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Label", "Last-Event-ID", "Last-Modified", "Link", "Location", "Lock-Token", "MIME-Version", "Man", "Max-Forwards", "Media-Range", "Message-ID", "Meter", "Negotiate", "Non-Compliance", "OPTION", "OPTIONS", "OWS", "Opt", "Optional", "Ordering-Type", "Origin", "Overwrite", "P3P", "PEP", "PICS-Label", "POST", "PUT", "Pep-Info", "Permanent", "Position", "Pragma", "ProfileObject", "Protocol", "Protocol-Query", "Protocol-Request", "Proxy-Authenticate", "Proxy-Authentication-Info", "Proxy-Authorization", "Proxy-Features", "Proxy-Instruction", "Public", "RWS", "Range", "Referer", "Refresh", "Resolution-Hint", "Resolver-Location", "Retry-After", "Safe", "Sec-Websocket-Extensions", "Sec-Websocket-Key", "Sec-Websocket-Origin", "Sec-Websocket-Protocol", "Sec-Websocket-Version", "Security-Scheme", "Server", "Set-Cookie", "Set-Cookie2", "SetProfile", "SoapAction", "Status", "Status-URI", "Strict-Transport-Security", "SubOK", "Subst", "Surrogate-Capability", "Surrogate-Control", "TCN", "TE", "TRACE", "Timeout", "Title", "Trailer", "Transfer-Encoding", "UA-Color", "UA-Media", "UA-Pixels", "UA-Resolution", "UA-Windowpixels", "URI", "Upgrade", "User-Agent", "Variant-Vary", "Vary", "Version", "Via", "Viewport-Width", "WWW-Authenticate", "Want-Digest", "Warning", "Width", "X-Content-Duration", "X-Content-Security-Policy", "X-Content-Type-Options", "X-CustomHeader", "X-DNSPrefetch-Control", "X-Forwarded-For", "X-Forwarded-Port", "X-Forwarded-Proto", "X-Frame-Options", "X-Modified", "X-OTHER", "X-PING", "X-PINGOTHER", "X-Powered-By", "X-Requested-With"];
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', allowedHeaders);

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    }
    else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
    // check header or url parameters or post parameters for token
    //const token = req.headers['authorization'];
    const token = req.headers['x-access-token'] || req.body.token || req.query.token
    console.log("token:" + token);

    if (!token)
        return res.status(402).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });
    // verifies secret and checks exp
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err) return res.status(403).send({
            error: 'Unauthorized',
            message: 'Failed to authenticate token.' + token
        });

        // if everything is good, save to request for use in other routes
        console.log("User actually logged in")
        req.userId = decoded.id;
        next();
    });
};

/* Check that who made the http request has the right to EDIT the request */
const checkOwnerRequest = (req, res, next) => {

    // Find the TRUE owner of the requests
    const request_id = req.params.id;
    console.log("request_id", request_id);

    RequestModel.findById(request_id).exec()
        .then((data) => {
            if (!data) {
                throw new Error('Cannot find any request with such ID. ');
            }

            // Get the owner of the requests
            let host = data.host;
            let executor = req.userId;

            if (!(host == executor)){
                return res.status(402).send({
                    error: 'Unauthorized',
                    message: 'You are not the host for such requests. Cannot edit.'
                });
            }
            next()
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


/* Check that who made the http request has the right to EDIT the listing */

const checkOwnerListing = (req, res, next) => {

    // Find the TRUE owner of the requests
    const listing_id = req.params.id;

    ListingModel.findById(listing_id).exec()
        .then((listing) => {
            if (!listing) {
                throw new Error('Cannot find any listing with such ID. ');
            }

            // Get the owner of the listing
            let owner = listing.owner;
            let executor = req.userId;

            if (!(owner == executor)){
                return res.status(402).send({
                    error: 'Unauthorized',
                    message: 'You are not the host for such requests. Cannot edit.'
                });
            }
            next()
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


const checkHostSeekerContract = (req, res, next) => {

    const contract_id = req.params.id;

    ContractModel.findById(contract_id).exec()
        .then((contract) => {
            if (!contract) {
                throw new Error('Cannot find any contract with such ID. ');
            }

            return RequestModel.findById(contract.request).exec();

        }).then((request) => {
            if (!request) {
                throw new Error('Cannot find any request linked to such contract with such ID. ');
            }

            let executor = req.userId;

            console.log("checkHostSeekerContract executor: ", executor);
            console.log("checkHostSeekerContract request.seeker: ", request.seeker);
            console.log("checkHostSeekerContract request.host : ", request.host );

            if (request.seeker == executor){
                req.userType = "seeker";
            } else if (request.host == executor){
                req.userType = "host";
            } else{
                return res.status(402).send({
                    error: 'Unauthorized',
                    message: 'You are not authorized to handle this contract.'
                });
            }
            next()
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: err })
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    errorHandler,
    checkOwnerRequest,
    checkOwnerListing,
    checkHostSeekerContract
};
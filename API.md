# API


# IMPLEMENTED

## LISTING homepage (Ghania)
- [X] GET /listings
- [X] GET /listings/:id

## LISTINGS
- [X] POST /listings
- [X] GET /listings/:id/requests
- [X] GET /listings/:id/contracts
- [ ] PUT /listings/:id (NOT PRIORITY)

## USER
- [X] GET /users/:id (PUBLIC)

- [X] GET /users/requests/pending
- [X] GET /users/contracts/active
- [X] GET /users/contracts/past

- [X] GET /users/:id/listings

## AUTH 
- [X] POST /auth/register
- [X] POST /auth/login
- [X] GET /auth/me (AUTHENTICATION NEEDED. Used for profile)

## REQUESTS
- [X] POST /   (create new request)
- [X] GET /:id 
- [X] PUT /requests/:id/accept
- [X] PUT /requests/:id/decline
- [X] DELETE /:id (delete request, only if status == 'initialised')

## CONTRACT
- [X] GET /contracts/:id
- [ ] PUT /contracts/:id/pay (param: amount, seeker)
- [X] PUT /contracts/:id/confirmDeposit
- [X] PUT /contracts/:id/confirmPickUp

## UTILITY
- [X] POST /incrementBalance


# FLOW (rewritten, monday 25 June)

[HOST]
POST /listings

[SEEKER]
POST /requests/ [contain a field listings that contain listings ID]

[HOST]
PUT /requests/accept/:id --> a contract is created.
PUT /requests/decline/:id 


# Dummy Data
## Users
3 Dummy users, with

__password__: xyz

__email__(3 different):
test1@test.com
test2@test.com
test3@test.com

## Listings
4 Dummy listings
returned by GET /listings
Get All

---

curl -H "Content-Type: application/json" http://localhost:3000/listings

[{"address":{"location":{"lat":48,"lng":11},"formatted_address":"Eisbach"},"_id":"5b1a665aaac91b0f445ff104","title":"blah3","description":"great trees","__v":0},{"address":{"location":{"lat":48,"lng":11},"formatted_address":"Eisbach"},"_id":"5b1a65920747ef0eb4c17254","title":"test","description":"great trees","__v":0},{"address":{"location":{"lat":48,"lng":11},"formatted_address":"TUM Campus"},"_id":"5b1a65920747ef0eb4c17255","title":"test2","description":"great university","__v":0},{"address":{"location":{"lat":48,"lng":11},"formatted_address":"TUM Campus"},"_id":"5b1a665aaac91b0f445ff105","title":"test4","description":"great university","__v":0}]

---

By ID

---

curl -H "Content-Type: application/json" http://localhost:3000/listings/5b1a665aaac91b0f445ff104

{"address":{"location":{"lat":48,"lng":11},"formatted_address":"Eisbach"},"_id":"5b1a665aaac91b0f445ff104","title":"blah3","description":"great trees","__v":0}

---

## To log the user in, so as to be able to do POST/PUT on Listing etc:
send email & password using POST to /auth/login
- it returns a token.
- use the token in future requests (if you use browser: it will already work, from SEBA version. If you use cURL: manually paste it in as a property)

### Example code:
curl -H "Content-Type: application/json" -d '{"email":"test3@test.com","password":"xyz"}' http://localhost:3000/auth/login

### Infinite login JWT for test1
for user1, there exists an infinitely valid user token:
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViMWE4OWUyZjM5MzNkMjU1ZTAxNDBlMCIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1Mjg0NjU5MjUsImV4cCI6MTYyODQ2NTkyNH0.VVF8eg6GNw29Zr64hKEkrD2cz_6WUT7HimOkkz5MEGo"}

you can make these for other users by appending property "infinite":1 to the login request, as the default expiration is 24 hours.

## USER

GET /users/id
Return user by id

---
curl -H "Content-Type: application/json" http://localhost:3000/users/5b1a864b984e532156f2a588

{"name":{"first":"David","last":"Grüne"},"listings":[],"_id":"5b1a864b984e532156f2a588","status":"default","balance":15.56,"__v":0}

---

Detailed:

---
curl -H "Content-Type: application/json" http://localhost:3000/users/detailed/5b1a864b984e532156f2a588

{"name":{"first":"David","last":"Grüne"},"listings":[],"_id":"5b1a864b984e532156f2a588","email":"test3@test.com","status":"default","balance":15.56,"__v":0}

---


CRUD₁  (DELETE: ADMIN REQUIRED)
Read : 

---
 curl -H "Content-Type: application/json" http://localhost:3000/users
 
[{"name":{"first":"Rahul","last":"Joe"},"listings":[],"_id":"5b1a8434984e532156f2a587","status":"default","balance":10,"__v":0},{"name":{"first":"David","last":"Grüne"},"listings":[],"_id":"5b1a864b984e532156f2a588","status":"default","balance":15.56,"__v":0},{"name":{"first":"Romeo","last":"Vaenio"},"listings":[],"_id":"5b1a89e2f3933d255e0140e0","status":"default","balance":100.67,"__v":0}

---

^^ PUT works the same route, but POST uses auth/register. So all except Delete, which is removed, implemented

/users/ban/id (PUT, ADMIN REQUIRED)
If calling users “Admin” value is true, then the user specified has their status value altered (ie. “active → banned”)


/users/resetPassword [email] (GET)
Sends user a password reset email; if email parameter exists


/users/detailed/id (GET, PUT) CONNECTION REQUIRED
Returns sensitive information like phone number, address, hence only the company or two people who have an existing connection (ie. a Host who has accepted a seekers offer) can access this level of information


/users/financial
Internally redirect to Transactions + list balance


/users/reviews/id (CRUD, DELETE: ADMIN REQUIRED, POST; PUT: CONNECTION REQUIRED)
Internally redirect to Reviews
ONLY HOST: TRUE accounts have reviews


/users/requestOutPay/id (GET)
Host can request to get paid, affects Contracts.


/users/favourites (CRUD)
View stored favourites, create favourite, etc. so user can keep track of listings they are interested in


# LISTINGS

GET /listings


CRUD  (DELETE: ADMIN REQUIRED)
/listings/user/id (GET)₃
/listings/in ? [latitude, longitude, km, amount] (GET)₂
/listings/requests/id (GET) VERIFICATION REQUIRED


# Requests
CRUD (DELETE: ADMIN REQUIRED)
/requests/user/id (GET)₃ VERIFICATION REQUIRED ₄
/requests/accept/id VERIFICATION REQUIRED
/requests/decline/id VERIFICATION REQUIRED

# Reviews
CRUD (DELETE: ADMIN REQUIRED, POST; PUT: CONNECTION REQUIRED)

# Utility
GET /utility/minutesBetween [latitude, longitude, listing id]
GET /utility/makePayment [(user)id, eur]
MOCK ROUTE: Always returns 200, that payment was externally successful, creates a Transaction. Payment *towards* us, payments to Hosts occur from internal data manager functions that create Transactions and alter the Hosts balance property


# Transactions
CRUD₁  (DELETE: ADMIN REQUIRED)



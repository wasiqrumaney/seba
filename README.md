# Root Directory of StoreIt4me
When you finish a task, write the start of your first name in the brackets, ie. Gh, Ja, Jo, Wa

e.g.
- [ ] Sign up for account
-->
- [Ja] Sign up for account

Task complete means: develop branch has been commited to with the changes, and there are no errors.


## TODO

### FRONTEND

#### REACT

- [ ] Users (as user) [Ghania]
- [ ] Create listing (as host) [Jonny]
- [ ] View listing list (as host) [Jonny]
- [ ] Edit listing (as host) [Jonny]
- [ ] See the listings list (as vistitor) [Ghania]

### BACKEND
- [ ] Backend General
    - [Ja] Create working stable version with Mongoose types
    - [Ja] Integrate with front end
    - [Ja] Output to console status of DB upon load

- [X] mLAb
    - [Ja] Sign up for group account // details in config.js
    - [Ja] Create mongo db "seba", collections "user" + "listing"
    - [Ja] Connect in config.js to local copy of seba backend
- [ ] Edit Mongoose Types
    - [Wa] Users (username-->email, balance, psw, host: B, seeker: B, status) // mostly done
    - [Ja] Listing (Title, Description, Price, Owner, Long/Lat, (derived Address)) // google offers simple "formatted_address" comma-seperated format
    - [Wa] Request (Host, Seeker, Listing, startDate, endDate, Message)
    - [Wa] Contract (Host, Seeker, Listing, startDate, endDate)
    
- [ ] Create base router, controller and model files for entities:
    - [Wa] User
    - [Ja] Listing (converted from Movie)
    - [Jo] Review (model done?)

- [ ] Implement real routes
    - [ ] Users
        - [Wa] View Profile
        - [Wa] Edit Profile
    - [ ] Listing
        - [Ja] Create Listing
        - [Ja] View Listing
            - [Ja] As Visitor
            - [ ] As Host
        - [Ja] Edit Listing
        - [Ja] Delete Listing
    - [ ] Contract
        - [Wa] View Profile
        - [Wa] Edit Profile
    - [ ] Request
        - [Wa] View Profile
        - [Wa] Edit Profile

### TEAM

- [ ] Mongoose


## RULES

Sign-up (As Airbnb)

- email
- first name
- last name
- password
- birthday:
    - month
    - day
    - year
- no ads checkbox

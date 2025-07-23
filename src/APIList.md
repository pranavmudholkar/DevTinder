# DevTinder APIs:

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view 
- PATCH /profile/edit
- PATCH /profile/password
- DELETE /profile - to delete the account


## connectionRequestRouter
- POST /request/send/interested/:userid
- POST /request/send/ignored/:userid
- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:requestid

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profile of other user on the platform

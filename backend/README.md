# 

## Manual API calls
- when server is running

" curl -H "Content-Type: application/json" -d '{"email":"xyz","password":"xyz", "seeker":1, "host":0, "name": {"first":"Jameson", "last":"Smith"}}' http://localhost:3000/auth/register"

- change the route (URL, last argument)

- change the properties ("email", "password", etc.)

__ Must be JSON content type or properties are not reableable!__
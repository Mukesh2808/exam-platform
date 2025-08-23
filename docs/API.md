# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Registers a fresh user account and returns a signed JWT for immediate authentication.

To register a user, send a POST request to /api/auth/register with a JSON body that includes three fields:

name – the person’s full name, at least three characters and no longer than fifty.

email – a valid, unique e-mail address the system will use for login and for sending any notifications.

password – a string of eight or more characters that contains at least one letter and one number; it is hashed on the server before being stored.

If all three values pass validation and the e-mail is not already in use, the server creates the account, stores the hashed password, and immediately returns a success response containing a signed JWT. The client can store that token (for example in localStorage) and include it as a Bearer token in the Authorization header of subsequent requests.

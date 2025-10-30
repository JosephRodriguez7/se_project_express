# WTWR — Backend (Express + MongoDB)

This is the backend for the WTWR (What To Wear) application. It provides a JSON API backed by MongoDB and implements user authentication via JWT, password hashing with bcrypt, and ownership checks for protected actions.

### The frontend repo can be found here:

[text](https://github.com/JosephRodriguez7/se_project_react)

## Features

- User registration (POST /signup)
- User login (POST /signin) — returns a JWT
- Get current user (GET /users/me) — protected
- Update user profile (PATCH /users/me) — protected
- Get clothing items (GET /items)
- Create clothing item (POST /items) — protected
- Delete clothing item (DELETE /items/:itemId) — protected, only owners

## Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or remote)

## Install & Run

```bash
cd se_project_express
npm install
# Ensure MongoDB is running locally or set MONGO_URI
node app.js
# or, if you have a dev script (nodemon):
npm run dev
```

By default the app connects to `mongodb://127.0.0.1:27017/wtwr_db` and listens on port `3001`.

## Environment variables

- `JWT_SECRET` — recommended to set in production (defaults to a built-in dev value)
- `PORT` — port to listen on (defaults to 3001)
- `MONGO_URI` — optional connection string to override the built-in MongoDB URL

## API (quick reference)

Auth / Users

- POST /signup — body: { name, avatar, email, password }
- POST /signin — body: { email, password } → returns { token }
- GET /users/me — headers: Authorization: Bearer <token>
- PATCH /users/me — headers: Authorization: Bearer <token>, body: { name, avatar }

Items

- GET /items — list items
- POST /items — headers: Authorization: Bearer <token>, body: { name, imageUrl, weather }
- DELETE /items/:itemId — headers: Authorization: Bearer <token> (only owner can delete)

## Example curl

Register and login flow:

```bash
curl -X POST http://localhost:3001/signup \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","avatar":"https://example.com/a.png","email":"alice@example.com","password":"password123"}'

curl -X POST http://localhost:3001/signin \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"password123"}'
```

Use the returned token for protected requests:

```bash
curl -X PATCH http://localhost:3001/users/me \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"name":"Alice New","avatar":"https://example.com/a2.png"}'
```

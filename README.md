## Next.js Chat Application with Google Authentication

This is a web application built using Next.js that serves as a real-time chat platform with Google authentication. The application utilizes Redis as the database to store user information and chat messages.

## Features

Google Authentication: Users can sign in securely using their Google accounts.

Real-time Messaging: Users can send and receive messages in real-time within the application.

Friend Management: Users can send friend requests, accept or deny friend requests, and manage their friend list.

Persistent Data Storage: Redis is used as the database to store user information, friend relationships, and chat messages.

## Technologies Used

Next.js: Next.js is a React framework for building server-side rendered (SSR) and statically generated web applications.

Redis: Redis is an open-source, in-memory data structure store used as a database, cache, and message broker.

Google Authentication: Google authentication is implemented using OAuth 2.0 for secure user sign-in.

WebSocket Communication: Pusher is used to open WebSocket connections, enabling real-time communication 

between clients.
messaging functionality.


## Setup Instructions
Clone the Repository:

``` bash 
git clone https://github.com/your-username/nextjs-chat-app.git
```

``` bash
Copy code
cd nextjs-chat-app
npm install
```
Set up Environment Variables:

Create a .env file in the root directory.
Define the following environment variables:
makefile
Copy code
``` bash

REDIS_HOST=redis-host
REDIS_PORT=redis-port
REDIS_PASSWORD=redis-password

NEXTAUTH_SECRET=suppersecret

UPSTASH_REDIS_REST_URL=your-upstah-url
UPSTASH_REDIS_REST_TOKEN=your-upstah-tocken

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

PUSHER_APP_ID = your-pusher-id
NEXT_PUBLIC_PUHER_APP_KEY = your-pusher-app-key
PUSHER_APP_SECRET = your-pusher-secret
```

## Run the Application:
``` bash
npm run dev
Access the Application:
```
Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).


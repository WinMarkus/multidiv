# multidiv

A simple multiplication and division calculator web application built with Node.js and Express.

## Features

- Multiplication of two numbers
- Division of two numbers
- Simple and intuitive web interface
- RESTful API endpoints
- Health check endpoint for monitoring

## Local Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The server will start on port 3000 (or the PORT environment variable if set).

Visit `http://localhost:3000` in your browser to use the calculator.

## API Endpoints

### Multiply
```
GET /api/multiply?a={number1}&b={number2}
```

### Divide
```
GET /api/divide?a={number1}&b={number2}
```

### Health Check
```
GET /health
```

## Deploying to Render

This application is ready to be deployed on [Render](https://render.com).

### Quick Deploy

1. Fork or clone this repository
2. Sign up for a free account at [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` configuration file
6. Click "Create Web Service"

### Manual Deploy

If you prefer to configure manually:

1. Go to the Render Dashboard
2. Click "New +" and select "Web Service"
3. Connect your repository
4. Configure the following:
   - **Name**: multidiv (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL.

## Configuration

The application uses the following environment variables:

- `PORT`: The port on which the server listens (default: 3000)
- `NODE_ENV`: The environment mode (set to "production" for Render deployments)

## Project Structure

```
multidiv/
├── server.js           # Express server and API endpoints
├── public/
│   └── index.html     # Frontend web interface
├── package.json       # Node.js dependencies and scripts
├── render.yaml        # Render deployment configuration
└── README.md          # This file
```

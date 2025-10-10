# Deployment Guide

## Local Development

### Prerequisites
- Node.js v16 or higher
- npm

### Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Create environment file:
```bash
cd client
cp .env.example .env
```

3. Start the development servers:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

4. Open http://localhost:5173 in your browser

## Deploying to Render

### Option 1: Using Blueprint (Recommended)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will detect `render.yaml` and deploy automatically

### Option 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: multidiv
   - **Environment**: Node
   - **Build Command**: 
     ```
     cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**: 
     ```
     cd server && npm start
     ```
   - **Environment Variables**:
     - `NODE_ENV` = `production`

5. Click "Create Web Service"

### Production Environment

In production, the Express server serves both:
1. The API endpoints at `/api/*`
2. The built Vue frontend from `client/dist/`

The frontend automatically uses the same origin for API calls in production (no need to set VITE_API_URL).

## Architecture

```
┌─────────────────────────────────────┐
│         Render Web Service          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Express Server (Port 3000)  │ │
│  │                               │ │
│  │  ├─ API Routes (/api/*)      │ │
│  │  │  ├─ GET /api/problem      │ │
│  │  │  ├─ POST /api/check       │ │
│  │  │  └─ GET /api/health       │ │
│  │  │                           │ │
│  │  └─ Static Files (/)         │ │
│  │     (Vue Frontend from dist/)│ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Environment Variables

### Development
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

### Production
- `NODE_ENV`: Should be set to `production`
- `PORT`: Server port (automatically set by Render)

## Troubleshooting

### Build fails on Render
- Check that both client and server package.json files are valid
- Verify all dependencies are listed in package.json
- Check Render build logs for specific errors

### API calls fail in production
- Ensure NODE_ENV is set to 'production'
- Check that the server is serving static files from client/dist
- Verify the build command completed successfully

### Frontend shows blank page
- Check browser console for errors
- Verify the build created files in client/dist/
- Ensure the start command is running from the server directory

# 🧙‍♂️ Magical Math Academy (multidiv) ✨

A Harry Potter-themed math learning web application for children to practice multiplication and division with progressive difficulty.

## Features

- 🎯 **Progressive Difficulty**: Starts easy (1×1) and increases to challenging (99×99 for multiplication, 999÷99 for division)
- 📚 **Step-by-Step Explanations**: Wrong answers show long division or long multiplication steps
- 🎉 **Celebration Animations**: Harry Potter-themed celebrations every 5-10 correct answers
- 🏆 **Score Tracking**: Track streaks, score percentage, and total correct answers
- 🎨 **Harry Potter Theme**: Magical UI with Hogwarts colors and wizard emojis
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Deployment**: Render-ready configuration

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WinMarkus/multidiv.git
cd multidiv
```

2. Install dependencies for both client and server:
```bash
npm run install:all
```

Or install individually:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

You'll need to run both the backend server and the frontend client:

**Terminal 1 - Start the backend server:**
```bash
cd server
npm run dev
```
The server will start on http://localhost:3000

**Terminal 2 - Start the frontend client:**
```bash
cd client
npm run dev
```
The client will start on http://localhost:5173

Open your browser and navigate to http://localhost:5173 to use the app.

## Building for Production

Build the frontend:
```bash
cd client
npm run build
```

The built files will be in `client/dist/` directory.

## Deployment on Render

This app is configured for easy deployment on Render.

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure your service

### Option 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: multidiv
   - **Environment**: Node
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     - `NODE_ENV` = `production`

The app will be deployed and accessible at your Render URL.

## Game Instructions

1. **Choose Your Challenge**: Switch between Multiplication and Division spells
2. **Solve Problems**: Enter your answer and press "Cast Answer Spell" or hit Enter
3. **Learn from Mistakes**: Wrong answers show detailed step-by-step explanations
4. **Level Up**: Difficulty increases automatically as you get answers correct
5. **Celebrate**: Every 5 correct answers in a row triggers a magical celebration!

## Project Structure

```
multidiv/
├── client/              # Vue frontend
│   ├── src/
│   │   ├── components/  # Vue components
│   │   │   ├── MathGame.vue      # Main game component
│   │   │   ├── Explanation.vue   # Explanation modal
│   │   │   └── Celebration.vue   # Celebration animation
│   │   ├── App.vue      # Root component
│   │   ├── main.js      # App entry point
│   │   └── style.css    # Global styles (Tailwind)
│   ├── public/          # Static assets
│   └── package.json
├── server/              # Express backend
│   ├── index.js         # API server
│   └── package.json
├── render.yaml          # Render deployment config
├── package.json         # Root package.json with convenience scripts
└── README.md
```

## API Endpoints

- `GET /api/problem?difficulty=N&type=TYPE` - Get a new math problem
  - `difficulty`: 1-99 (affects number ranges)
  - `type`: `multiplication` or `division`
  
- `POST /api/check` - Check an answer
  - Body: `{ num1, num2, userAnswer, type }`
  - Returns: `{ isCorrect, correctAnswer, explanation? }`

- `GET /api/health` - Health check endpoint

## License

ISC
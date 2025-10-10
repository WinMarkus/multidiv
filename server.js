const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from Vue build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

// Generate a math problem based on difficulty level
function generateProblem(difficulty, type) {
  let num1, num2, answer;
  
  if (type === 'multiplication') {
    // Multiplication: 1x1 to 99x99
    const maxNum = Math.min(difficulty + 1, 99);
    num1 = Math.floor(Math.random() * maxNum) + 1;
    num2 = Math.floor(Math.random() * maxNum) + 1;
    answer = num1 * num2;
  } else {
    // Division: start small and grow
    const maxDivisor = Math.min(difficulty + 1, 99);
    const maxDividend = Math.min(difficulty * 10 + 10, 999);
    
    num2 = Math.floor(Math.random() * maxDivisor) + 1;
    // Ensure clean division
    const quotient = Math.floor(Math.random() * (Math.floor(maxDividend / num2))) + 1;
    num1 = num2 * quotient;
    answer = quotient;
  }
  
  return { num1, num2, answer, type };
}

// Generate step-by-step explanation
function generateExplanation(num1, num2, type) {
  if (type === 'multiplication') {
    const steps = [];
    const num2Str = num2.toString();
    let total = 0;
    
    // Long multiplication
    for (let i = num2Str.length - 1; i >= 0; i--) {
      const digit = parseInt(num2Str[i]);
      const place = num2Str.length - 1 - i;
      const multiplier = Math.pow(10, place);
      const partialProduct = num1 * digit * multiplier;
      
      steps.push({
        description: `${num1} × ${digit}${place > 0 ? ` × ${multiplier}` : ''} = ${partialProduct}`,
        value: partialProduct
      });
      total += partialProduct;
    }
    
    return {
      steps,
      total,
      explanation: `Breaking down ${num1} × ${num2}:`
    };
  } else {
    // Long division
    const quotient = Math.floor(num1 / num2);
    const remainder = num1 % num2;
    const steps = [];
    
    let dividend = num1;
    let currentQuotient = '';
    const dividendStr = dividend.toString();
    let workingNumber = 0;
    
    for (let i = 0; i < dividendStr.length; i++) {
      workingNumber = workingNumber * 10 + parseInt(dividendStr[i]);
      
      if (workingNumber >= num2) {
        const quotientDigit = Math.floor(workingNumber / num2);
        const subtractValue = quotientDigit * num2;
        
        steps.push({
          description: `${workingNumber} ÷ ${num2} = ${quotientDigit}`,
          working: workingNumber,
          subtract: subtractValue,
          remainder: workingNumber - subtractValue
        });
        
        currentQuotient += quotientDigit;
        workingNumber = workingNumber - subtractValue;
      } else if (currentQuotient !== '') {
        currentQuotient += '0';
      }
    }
    
    return {
      steps,
      quotient,
      remainder,
      explanation: `Dividing ${num1} by ${num2}:`
    };
  }
}

// API Routes
app.get('/api/problem', (req, res) => {
  const difficulty = parseInt(req.query.difficulty) || 1;
  const type = req.query.type || 'multiplication';
  
  const problem = generateProblem(difficulty, type);
  res.json(problem);
});

app.post('/api/check', (req, res) => {
  const { num1, num2, userAnswer, type } = req.body;
  const correctAnswer = type === 'multiplication' ? num1 * num2 : Math.floor(num1 / num2);
  const isCorrect = parseInt(userAnswer) === correctAnswer;
  
  let explanation = null;
  if (!isCorrect) {
    explanation = generateExplanation(num1, num2, type);
  }
  
  res.json({
    isCorrect,
    correctAnswer,
    explanation
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Catch-all route for production - serve index.html for all non-API routes
if (process.env.NODE_ENV === 'production') {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

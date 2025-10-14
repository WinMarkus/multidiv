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
    // Multiplication: Scale more aggressively with difficulty
    let maxNum1, maxNum2;
    
    switch(difficulty) {
      case 1: maxNum1 = 5; maxNum2 = 5; break;      // 1-5 × 1-5
      case 2: maxNum1 = 10; maxNum2 = 10; break;    // 1-10 × 1-10
      case 3: maxNum1 = 12; maxNum2 = 12; break;    // 1-12 × 1-12 (times tables)
      case 4: maxNum1 = 15; maxNum2 = 15; break;    // 1-15 × 1-15
      case 5: maxNum1 = 20; maxNum2 = 20; break;    // 1-20 × 1-20
      case 6: maxNum1 = 25; maxNum2 = 25; break;    // 1-25 × 1-25
      case 7: maxNum1 = 50; maxNum2 = 20; break;    // 1-50 × 1-20
      case 8: maxNum1 = 99; maxNum2 = 25; break;    // 1-99 × 1-25
      case 9: maxNum1 = 99; maxNum2 = 50; break;    // 1-99 × 1-50
      default: maxNum1 = 99; maxNum2 = 99; break;   // 1-99 × 1-99
    }
    
    num1 = Math.floor(Math.random() * maxNum1) + 1;
    num2 = Math.floor(Math.random() * maxNum2) + 1;
    answer = num1 * num2;
  } else {
    // Division: Scale with difficulty, ensure clean division
    let maxDivisor, maxQuotient;
    
    switch(difficulty) {
      case 1: maxDivisor = 5; maxQuotient = 10; break;     // ÷1-5, quotient 1-10
      case 2: maxDivisor = 10; maxQuotient = 10; break;    // ÷1-10, quotient 1-10
      case 3: maxDivisor = 12; maxQuotient = 12; break;    // ÷1-12, quotient 1-12
      case 4: maxDivisor = 15; maxQuotient = 15; break;    // ÷1-15, quotient 1-15
      case 5: maxDivisor = 20; maxQuotient = 20; break;    // ÷1-20, quotient 1-20
      case 6: maxDivisor = 25; maxQuotient = 25; break;    // ÷1-25, quotient 1-25
      case 7: maxDivisor = 20; maxQuotient = 50; break;    // ÷1-20, quotient 1-50
      case 8: maxDivisor = 25; maxQuotient = 99; break;    // ÷1-25, quotient 1-99
      case 9: maxDivisor = 50; maxQuotient = 99; break;    // ÷1-50, quotient 1-99
      default: maxDivisor = 99; maxQuotient = 99; break;   // ÷1-99, quotient 1-99
    }
    
    num2 = Math.floor(Math.random() * maxDivisor) + 1;
    const quotient = Math.floor(Math.random() * maxQuotient) + 1;
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
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
  } else if (type === 'division') {
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
  } else if (type === 'addition') {
    // Addition: 4-digit numbers with at least one carryover
    // Generate numbers that will have at least one digit sum >= 10
    let hasCarryover = false;
    let attempts = 0;
    
    while (!hasCarryover && attempts < 100) {
      // Generate 4-digit numbers (1000-9999)
      num1 = Math.floor(Math.random() * 9000) + 1000;
      num2 = Math.floor(Math.random() * 9000) + 1000;
      
      // Check if there's at least one carryover
      const str1 = num1.toString();
      const str2 = num2.toString();
      
      for (let i = 0; i < 4; i++) {
        const digit1 = parseInt(str1[3 - i]);
        const digit2 = parseInt(str2[3 - i]);
        if (digit1 + digit2 >= 10) {
          hasCarryover = true;
          break;
        }
      }
      attempts++;
    }
    
    answer = num1 + num2;
  } else if (type === 'subtraction') {
    // Subtraction: 4-digit numbers with at least one borrowing
    // Generate numbers where at least one digit in num1 is less than the corresponding digit in num2
    let hasBorrowing = false;
    let attempts = 0;
    
    while (!hasBorrowing && attempts < 100) {
      // Generate 4-digit numbers (1000-9999)
      num1 = Math.floor(Math.random() * 9000) + 1000;
      num2 = Math.floor(Math.random() * (num1 - 1000)) + 1000; // Ensure num2 < num1
      
      // Check if there's at least one borrowing
      const str1 = num1.toString();
      const str2 = num2.toString();
      
      for (let i = 0; i < 4; i++) {
        const digit1 = parseInt(str1[3 - i]);
        const digit2 = parseInt(str2[3 - i]);
        if (digit1 < digit2) {
          hasBorrowing = true;
          break;
        }
      }
      attempts++;
    }
    
    answer = num1 - num2;
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
  } else if (type === 'division') {
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
  } else if (type === 'addition') {
    // Addition with carryover
    const steps = [];
    const str1 = num1.toString().padStart(4, '0');
    const str2 = num2.toString().padStart(4, '0');
    let carry = 0;
    let result = '';
    
    for (let i = 3; i >= 0; i--) {
      const digit1 = parseInt(str1[i]);
      const digit2 = parseInt(str2[i]);
      const sum = digit1 + digit2 + carry;
      const digitResult = sum % 10;
      carry = Math.floor(sum / 10);
      
      steps.push({
        description: `${digit1} + ${digit2}${carry > 0 ? ` (+ carry ${carry})` : ''} = ${sum}`,
        position: 3 - i,
        digit1,
        digit2,
        sum,
        carry: carry,
        result: digitResult
      });
      
      result = digitResult + result;
    }
    
    if (carry > 0) {
      result = carry + result;
    }
    
    return {
      steps,
      result: parseInt(result),
      explanation: `Adding ${num1} + ${num2} step by step:`
    };
  } else if (type === 'subtraction') {
    // Subtraction with borrowing
    const steps = [];
    const str1 = num1.toString().padStart(4, '0');
    const str2 = num2.toString().padStart(4, '0');
    let borrow = 0;
    let result = '';
    
    for (let i = 3; i >= 0; i--) {
      let digit1 = parseInt(str1[i]) - borrow;
      const digit2 = parseInt(str2[i]);
      
      if (digit1 < digit2) {
        digit1 += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }
      
      const diff = digit1 - digit2;
      
      steps.push({
        description: `${digit1}${borrow > 0 ? ' (borrowed)' : ''} - ${digit2} = ${diff}`,
        position: 3 - i,
        digit1: parseInt(str1[i]),
        digit2,
        diff,
        borrowed: borrow > 0
      });
      
      result = diff + result;
    }
    
    return {
      steps,
      result: parseInt(result),
      explanation: `Subtracting ${num2} from ${num1} step by step:`
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
  let correctAnswer;
  
  switch(type) {
    case 'multiplication':
      correctAnswer = num1 * num2;
      break;
    case 'division':
      correctAnswer = Math.floor(num1 / num2);
      break;
    case 'addition':
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      correctAnswer = num1 - num2;
      break;
    default:
      correctAnswer = 0;
  }
  
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

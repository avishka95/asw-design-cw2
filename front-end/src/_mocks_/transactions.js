import { v4 as uuidv4 } from 'uuid';

const transactions = [
  {
    transactionId: uuidv4(),
    description: 'TEST',
    amount: 1.0,
    isIncome: true,
    month: "JANUARY",
    category: "TEST"
  },
  {
    transactionId: uuidv4(),
    description: 'TEST2',
    amount: 12.0,
    isIncome: false,
    month: "JANUARY",
    category: "TEST"
  },
  {
    transactionId: uuidv4(),
    description: 'TEST3',
    amount: 112.0,
    isIncome: true,
    month: "JANUARY",
    category: "TEST"
  },
  {
    transactionId: uuidv4(),
    description: 'TEST4',
    amount: 10.0,
    isIncome: false,
    month: "JANUARY",
    category: "TEST"
  }
];

export default transactions;

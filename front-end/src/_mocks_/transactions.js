import { v4 as uuidv4 } from 'uuid';

const transactions = [
  {
    id: uuidv4(),
    description: 'TEST',
    amount: 1.0,
    isIncome: true
  },
  {
    id: uuidv4(),
    description: 'TEST2',
    amount: 12.0,
    isIncome: false
  },
  {
    id: uuidv4(),
    description: 'TEST3',
    amount: 112.0,
    isIncome: true
  },
  {
    id: uuidv4(),
    description: 'TEST4',
    amount: 10.0,
    isIncome: false
  }
];

export default transactions;

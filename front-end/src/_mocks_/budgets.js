import { v4 as uuidv4 } from 'uuid';

const budgets = [
    {
        id: uuidv4(),
        month: "JANUARY",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: uuidv4(),
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "JANUARY",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: uuidv4(),
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "JANUARY",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: uuidv4(),
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "JANUARY",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: uuidv4(),
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
];

export default budgets;
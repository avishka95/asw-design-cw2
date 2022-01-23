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
                categoryId: 1,
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "FEBRUARY",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: 2,
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "MARCH",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: 3,
                name: "String",
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
    {
        id: uuidv4(),
        month: "APRIL",
        totalIncome: 10.0,
        totalExpense: 5.0,
        totalBudget: 7.0,
        categorylist: [
            {
                categoryId: uuidv4(),
                name: 2,
                budget: 2.0,
                spent: 1.0

            }
        ]
    },
];

export default budgets;
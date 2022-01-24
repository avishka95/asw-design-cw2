const API_ENDPOINT = "http://localhost:8080";
export const APP_CONFIG = {
    APIS: {
        GET_TRANSACTIONS: API_ENDPOINT + "/getTransactions",
        ADD_TRANSACTION: API_ENDPOINT + "/newTransaction",
        UPDATE_TRANSACTION: API_ENDPOINT + "/updateTransaction",
        DELETE_TRANSACTION: API_ENDPOINT + "/deleteTransaction",
        GET_BUDGETS: API_ENDPOINT + "/getBudgets",
        ADD_BUDGET: API_ENDPOINT + "/addBudget",
        GET_CATEGORIES: API_ENDPOINT + "/getCategories",
        CREATE_CATEGORY: API_ENDPOINT + "/newCategory"
    }
};
import { useState, useEffect, useReducer } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { FilledInput, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { getMonths } from 'src/utils/constants';
import useHttp from '../utils/http';
import { APP_CONFIG } from '../config';
import CurrencyInput from 'src/components/CurrencyInput';

const ACTIONS = {
    SET_LOAD_DATA: 'SET_DESCRIPTION',
    SET_AMOUNT: 'SET_AMOUNT',
    SET_IS_INCOME: 'SET_IS_INCOME',
    SET_MONTH: 'SET_MONTH',
    SET_CATEGORY: 'SET_CATEGORY',
    HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
    switch (action.type) {
        case ACTIONS.SET_AMOUNT:
            return { ...curTrasactionState, amount: action.amount }
        case ACTIONS.SET_MONTH:
            return { ...curTrasactionState, month: action.month }
        case ACTIONS.SET_CATEGORY:
            return { ...curTrasactionState, category: action.category }
        case ACTIONS.SET_CATEGORIES:
            return { ...curTrasactionState, categories: action.categories, categoryMap: action.categoryMap }
        default:
            throw new Error('Should not get here');
    }
}

export default function BudgetDialog(props) {
    const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
    const [{ amount, month, category, categories, categoryMap }, dispatchTransactions] = useReducer(transactionsReducer,
        { amount: 0.0, isIncome: true, month: "JANUARY", category: null, categories: [], categoryMap: {} });

    const handleClose = () => {
        props.handleClose(false);
    };

    const createBudget = () => {
        var payload = {
            month: month?.value ? month?.value : null,
            categorylist: [
                {
                    categoryId: category,
                    budget: amount
                }
            ]

        };
        sendRequest(APP_CONFIG.APIS.ADD_BUDGET, 'GET', payload, APP_CONFIG.APIS.ADD_BUDGET);
    };

    const getCategories = () => {
        sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
      };

    const handleAmount = (event) => {
        var value = parseFloat(event.target.value).toFixed(2);
        dispatchTransactions({ type: ACTIONS.SET_AMOUNT, amount: event.target.value });
    };

    const handleMonth = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_MONTH, month: event.target.value });
    };

    const handleCategory = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_MONTH, month: event.target.value });
    };

    useEffect(() => {
        switch (reqExtra) {
            case APP_CONFIG.APIS.ADD_BUDGET:
                if (data && !error) {
                    props.handleSnackbar("Successfully created budget!", "success");
                    handleClose();
                    props.load();
                } else if (error) {
                    props.handleSnackbar("Failed to create budget!", "error");
                }
                break;
            case APP_CONFIG.APIS.GET_CATEGORIES:
                if (data) {
                    var categoryMapTemp = {};
                    if (data.length) {
                        data.forEach(e => {
                            categoryMapTemp[e.categoryId] = e;
                        });
                    }
                    dispatchTransactions({ type: ACTIONS.SET_CATEGORIES, categories: data, categoryMap: categoryMapTemp });
                } else if (error) {
                    props.handleSnackbar("Failed to fetch categories!", "error");
                }
                break;
            default:
                break;
        }
    }, [data, reqExtra, isOpen, isLoading, error]);

    useEffect(() => {
        if (props.open) {
          getCategories();
        }
      }, [props.open]);

    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={handleClose}>
            <DialogTitle>New Budget</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <CurrencyInput value={amount} handleChange={handleAmount}/>
                    {/* <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            type="number"
                            onChange={handleAmount}
                            value={amount}
                            inputProps={{
                                maxLength: 13,
                                step: "1",
                                min: 0
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Amount"
                        />
                    </FormControl> */}
                    <FormControl fullWidth sx={{ m: 1, }}>
                        <InputLabel id="demo-simple-select-label">Month</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={month}
                            label="Month"
                            onChange={handleMonth}
                        >
                            {getMonths().map(e => {
                                return (<MenuItem value={e}>{e.title}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1, }}>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Category"
                            onChange={handleCategory}
                        >
                            {categories.map(e => {
                                return (<MenuItem value={e.categoryId}>{e.name}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={!category} variant="contained" onClick={createBudget}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

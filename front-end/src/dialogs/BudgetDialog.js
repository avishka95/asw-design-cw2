import { useState, useReducer } from 'react';
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
    case ACTIONS.SET_IS_INCOME:
      return { ...curTrasactionState, isIncome: action.isIncome }
    case ACTIONS.SET_MONTH:
      return { ...curTrasactionState, month: action.month }
    case ACTIONS.SET_CATEGORY:
      return { ...curTrasactionState, category: action.category }
    default:
      throw new Error('Should not get here');
  }
}

export default function BudgetDialog(props) {
  const [{ amount, isIncome, month, category }, dispatchTransactions] = useReducer(transactionsReducer,
    { amount: 0.0, isIncome: true, month: "JANUARY", category: "JANUARY" });

  const handleClose = () => {
    props.handleClose(false);
  };

  const handleAmount = (event) => {
    var value = parseFloat(event.target.value).toFixed(1);
    dispatchTransactions({ type: ACTIONS.SET_AMOUNT, amount: event.target.value });
  };

  const handleIsIncome = (event) => {
    dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: true });
  };

  const handleIsExpense = (event) => {
    dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: false });
  };

  const handleMonth = (event) => {
    console.log("TODO handleMonth",event.target.value)
    dispatchTransactions({ type: ACTIONS.SET_MONTH, month: event.target.value });
  };

  const handleCategory= (event) => {
    dispatchTransactions({ type: ACTIONS.SET_MONTH, month: event.target.value });
  };

  return (
      <Dialog maxWidth open={props.open} onClose={handleClose}>
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
            <FormControl fullWidth sx={{ m: 1 }}>
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
            </FormControl>
            <FormControl fullWidth sx={{ m: 1, }}>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
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
                // value={age}
                label="Category"
              // onChange={handleChange}
              >
                {getMonths().map(e => {
                  return (<MenuItem value={e}>{e.title}</MenuItem>);
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
  );
}

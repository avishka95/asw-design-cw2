import { useState, useReducer, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { CssBaseline, FilledInput, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { getMonths } from 'src/utils/constants';
import { APP_CONFIG } from 'src/config';
import useHttp from 'src/utils/http';
import CurrencyTextField from '@unicef/material-ui-currency-textfield/dist/CurrencyTextField';
import CurrencyInput from 'src/components/CurrencyInput';

const ACTIONS = {
  SET_LOAD_DATA: 'SET_DESCRIPTION',
  SET_AMOUNT: 'SET_AMOUNT',
  SET_IS_INCOME: 'SET_IS_INCOME',
  SET_MONTH: 'SET_MONTH',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_CATEGORIES: 'SET_CATEGORIES',
  HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
  switch (action.type) {
    case ACTIONS.SET_DESCRIPTION:
      return { ...curTrasactionState, description: action.description }
    case ACTIONS.SET_AMOUNT:
      return { ...curTrasactionState, amount: action.amount }
    case ACTIONS.SET_IS_INCOME:
      return { ...curTrasactionState, isIncome: action.isIncome }
    case ACTIONS.SET_MONTH:
      return { ...curTrasactionState, month: action.month }
    case ACTIONS.SET_CATEGORY:
      return { ...curTrasactionState, category: action.category }
    case ACTIONS.SET_CATEGORIES:
      return { ...curTrasactionState, categories: action.categories, categoryMap: action.categoryMap }
    case ACTIONS.HANDLE_RESET:
      return { ...curTrasactionState, description: "", amount: 0.0, isIncome: true, month: null, category: null }
    default:
      throw new Error('Should not get here');
  }
}

export default function TransactionDialog(props) {
  const [open, setOpen] = useState(false);
  const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
  const [{ description, amount, isIncome, month, category, categories, categoryMap }, dispatchTransactions] = useReducer(transactionsReducer,
    { description: "", amount: 0.0, isIncome: true, month: null, category: null, categories: [], categoryMap: {} });


  const handleConfirm = () => {
    props.data.transactionId ? updateTransaction() : createTransaction();
  };
  const createTransaction = () => {
    var payload = {
      "description": description,
      "amount": Number(amount),
      "categoryId": category,
      "month": month ? month.value : null,
      "isIncome": isIncome
    };
    sendRequest(APP_CONFIG.APIS.ADD_TRANSACTION, 'POST', payload, APP_CONFIG.APIS.ADD_TRANSACTION);
  };

  const updateTransaction = () => {
    var payload = {
      "description": description,
      "amount": Number(amount),
      "categoryId": category,
      "month": month ? month.value : null,
      "isIncome": isIncome
    };
    sendRequest(APP_CONFIG.APIS.UPDATE_TRANSACTION + "/" + props.data.transactionId, 'POST', payload, APP_CONFIG.APIS.UPDATE_TRANSACTION);
  };

  const getCategories = () => {
    sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
  };


  const handleClose = () => {
    props.handleClose();
  };

  const handleDescription = (event) => {
    dispatchTransactions({ type: ACTIONS.SET_DESCRIPTION, description: event.target.value });
  };

  const handleAmount = (event) => {
    var value = parseFloat(event.target.value).toFixed(2);
    dispatchTransactions({ type: ACTIONS.SET_AMOUNT, amount: event.target.value });
  };

  const handleIsIncome = (event) => {
    dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: true });
  };

  const handleIsExpense = (event) => {
    dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: false });
  };

  const handleMonth = (event) => {
    console.log("TODO handleMonth", event.target.value)
    dispatchTransactions({ type: ACTIONS.SET_MONTH, month: event.target.value });
  };

  const handleCategory = (event) => {
    console.log("TODO handleCategory", event.target.value)
    dispatchTransactions({ type: ACTIONS.SET_CATEGORY, category: event.target.value });
  };

  useEffect(() => {
    switch (reqExtra) {
      case APP_CONFIG.APIS.ADD_TRANSACTION:
        if (data && !error) {
          props.handleSnackbar("Successfully created transaction!", "success");
          handleClose();
          props.load();
        } else if (error) {
          props.handleSnackbar("Failed to create transaction!", "error");
        }
        break;
      case APP_CONFIG.APIS.UPDATE_TRANSACTION:
        if (data && !error) {
          props.handleSnackbar("Successfully updated transaction!", "success");
          handleClose();
          props.load();
        } else if (error) {
          props.handleSnackbar("Failed to update transaction!", "error");
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
    } else {
      dispatchTransactions({ type: ACTIONS.HANDLE_RESET });
    }
  }, [props.open]);

  useEffect(() => {

  }, [props.data]);

  return (
    <Dialog fullWidth maxWidth={'lg'} open={props.open} onClose={handleClose}>
      <DialogTitle>{props.data.transactionId ? "Update Transaction" : "New Transaction"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item xs={6}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <span>
                  <CurrencyInput value={amount} handleChange={handleAmount}/>
                  {/* <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      type="number"
                      sx={{ width: 400 }}
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
                </span>
                <span>
                  <ButtonGroup color={isIncome ? "error" : "primary"} aria-label="income and expense button group">
                    <Button onClick={handleIsIncome} variant={isIncome ? "contained" : "outlined"} color="primary" key="income">Income</Button>
                    <Button onClick={handleIsExpense} variant={isIncome ? "outlined" : "contained"} color="error" key="expense">Expense</Button>
                  </ButtonGroup>
                </span>
              </Stack>

            </Grid>
            <Grid item xs={6}>

            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                // required
                id="description-required"
                label="Description"
                value={description}
                onChange={handleDescription}
              // defaultValue="Transaction"
              />
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
            <Grid item xs={4}>
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
            </Grid>

          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>{props.data.transactionId ? "Update" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}

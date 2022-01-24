import { useState, useReducer, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Avatar, Divider, FilledInput, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { getMonths } from 'src/utils/constants';
import useHttp from '../utils/http';
import { APP_CONFIG } from 'src/config';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { isNull } from 'lodash';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CATEGORIES_LIST from '../_mocks_/categories';
import Label from 'src/components/Label';


const ACTIONS = {
    SET_NAME: 'SET_NAME',
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_IS_INCOME: 'SET_IS_INCOME',
    HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
    switch (action.type) {
        case ACTIONS.SET_NAME:
            return { ...curTrasactionState, name: action.name }
        case ACTIONS.SET_CATEGORIES:
            return { ...curTrasactionState, categories: action.categories, categoryMap: action.categoryMap }
        case ACTIONS.SET_IS_INCOME:
            return { ...curTrasactionState, isIncome: action.isIncome }
        default:
            throw new Error('Should not get here');
    }
}

export default function CategoryDialog(props) {
    const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
    const [{ name, categories, categoryMap, isIncome }, dispatchTransactions] = useReducer(transactionsReducer,
        { name: "", categories: [], categoryMap: {}, isIncome: true });

    const handleName = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_NAME, name: event.target.value });
    };

    const createCategory = () => {
        var payload = {
            categoryName: name
        };

        sendRequest(APP_CONFIG.APIS.CREATE_CATEGORY, 'POST', payload, APP_CONFIG.APIS.CREATE_CATEGORY);
    };

    const getCategories = () => {

        sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
    };

    const deleteCategory = (id) => () => {
        if (id) {
            sendRequest(APP_CONFIG.APIS.DELETE_CATEGORY + "/" + id, 'DELETE', null, APP_CONFIG.APIS.DELETE_CATEGORY);
        }
    };

    const handleDeleteCategory = (id) => () => {
        props.handleConfirmation("Are you sure you want to delete this category?", deleteCategory(id))
    };

    const handleIsIncome = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: true });
    };

    const handleIsExpense = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_IS_INCOME, isIncome: false });
    };

    useEffect(() => {
        getCategories();
    }, [props.open])

    useEffect(() => {


    }, [])

    useEffect(() => {
        switch (reqExtra) {
            case APP_CONFIG.APIS.CREATE_CATEGORY:
                if (data && !error) {
                    getCategories();
                    dispatchTransactions({ type: ACTIONS.SET_NAME, name: "" });
                    props.handleSnackbar("Successfully created category!", "success");
                } else if (error) {
                    props.handleSnackbar("Failed to create category!", "error");
                }
                break;
            case APP_CONFIG.APIS.GET_CATEGORIES:
                // var data = CATEGORIES_LIST;
                if (data && !error) {
                    var categoryMapTemp = {};
                    if (Array.isArray(data)) {
                        data.forEach(e => {
                            categoryMapTemp[e.categoryId] = e;
                        });
                    }
                    dispatchTransactions({ type: ACTIONS.SET_CATEGORIES, categories: data, categoryMap: categoryMapTemp });
                } else if (error) {
                    props.handleSnackbar("Failed to fetch categories!", "error");
                }
                break;

            case APP_CONFIG.APIS.DELETE_CATEGORY:
                if (data && !error) {
                    getCategories();
                    props.handleSnackbar("Successfully deleted category!", "success");
                } else if (error) {
                    props.handleSnackbar("Failed to delete category!", "error");
                }
                break;
            default:
                break;
        }
    }, [data, reqExtra, isOpen, isLoading, error]);

    return (
        <Dialog fullWidth maxWidth={"md"} open={props.open}>
            <DialogTitle>Add/Remove Categories</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ m: 2 }}>

                    <Stack direction="row"
                        justifyContent="flex-start"
                        alignItems="center" spacing={2}>
                        <span>
                            <InputLabel htmlFor="outlined-adornment-category">Category Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-category"
                                sx={{ width: 500, }}
                                value={name}
                                onChange={handleName}
                                label="Category Name"
                            />
                        </span>
                        <span>
                            <ButtonGroup color={isIncome ? "error" : "primary"} aria-label="income and expense button group">
                                <Button size="small" onClick={handleIsIncome} variant={isIncome ? "contained" : "outlined"} color="primary" key="income">Income</Button>
                                <Button size="small" onClick={handleIsExpense} variant={isIncome ? "outlined" : "contained"} color="error" key="expense">Expense</Button>
                            </ButtonGroup>
                        </span>
                        <span>
                            <Button disabled={!name} variant="contained" startIcon={<AddIcon />} onClick={createCategory}>
                                Create New
                            </Button>
                        </span>
                    </Stack>


                </FormControl>
                <Divider />
                <div style={{ padding: 10 }}>
                    <Typography variant="button" display="block" gutterBottom>
                        Categories
                    </Typography>
                    <div>
                        {isLoading && <LinearProgress />}
                    </div>
                    <List>
                        {categories && categories.length ? categories.map(category => {
                            return (
                                <ListItem secondaryAction={
                                    category.isCustom ?
                                        <IconButton onClick={handleDeleteCategory(category.categoryId)} aria-label="expand row" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                        :
                                        null
                                }>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                        </ListItemAvatar>
                                        {/* <ListItemText
                                    primary={category.categoryName}
                                /> */}
                                        <Label variant="ghost" color={category.isIncome ? 'success' : 'error'}>{category.categoryName}</Label>
                                    </ListItemButton>
                                </ListItem>);
                        }) : <span style={{ textAlign: 'center' }}><Typography variant="caption" display="block" gutterBottom>
                            Nothing to show
                        </Typography></span>}
                    </List>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

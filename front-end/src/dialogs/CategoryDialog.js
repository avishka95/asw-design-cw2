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
import { Avatar, Divider, FilledInput, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import { getMonths } from 'src/utils/constants';
import useHttp from '../utils/http';
import { APP_CONFIG } from 'src/config';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { isNull } from 'lodash';
import Typography from '@mui/material/Typography';

const ACTIONS = {
    SET_NAME: 'SET_NAME',
    SET_CATEGORIES: 'SET_CATEGORIES',
    HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
    switch (action.type) {
        case ACTIONS.SET_NAME:
            return { ...curTrasactionState, name: action.name }
        case ACTIONS.SET_CATEGORIES:
            return { ...curTrasactionState, categories: action.categories }
        default:
            throw new Error('Should not get here');
    }
}

export default function CategoryDialog(props) {
    //   const [open, setOpen] = useState(false);
    const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
    const [{ name, categories }, dispatchTransactions] = useReducer(transactionsReducer,
        { name: "", categories: [] });

    //   const handleClickOpen = () => {
    //     setOpen(true);
    //   };

    //   const handleClose = () => {
    //     setOpen(false);
    //   };

    const handleName = (event) => {
        dispatchTransactions({ type: ACTIONS.SET_NAME, name: event.target.value });
    };

    const createCategory = () => {
        var payload = {
            name: name
        };

        sendRequest(APP_CONFIG.APIS.CREATE_CATEGORY, 'POST', payload, APP_CONFIG.APIS.CREATE_CATEGORY);
    };

    const getCategories = () => {

        sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
    };

    useEffect(() => {
        getCategories();
    }, [props.open])

    useEffect(() => {


    }, [])

    useEffect(() => {
        switch (reqExtra) {
            case APP_CONFIG.APIS.CREATE_CATEGORY:
                if (data) {
                    props.handleClose();
                } else if (error) {

                }
                break;
            case APP_CONFIG.APIS.GET_CATEGORIES:

                if (data) {

                } else if (error) {

                }
                const TODO_TEST_CATEGORIES = [
                    {
                        name: "Test Cat",
                        isCustom: true,
                        categoryId: 1
                    },
                    {
                        name: "Test Cat2",
                        isCustom: false,
                        categoryId: 2
                    }
                ];
                dispatchTransactions({ type: ACTIONS.SET_CATEGORIES, categories: TODO_TEST_CATEGORIES });
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
                        justifyContent="space-between"
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
                            <Button variant="outlined" startIcon={<AddIcon />}>
                                Create New
                            </Button>
                        </span>
                    </Stack>


                </FormControl>
                <Divider />
                <div style={{padding:10}}>
                    <Typography variant="button" display="block" gutterBottom>
                        Categories
                    </Typography>
                    <List>
                        {categories.map(category => {
                            return (<ListItem
                                secondaryAction={
                                    category.isCustom ?
                                        <IconButton aria-label="expand row" size="small">
                                            <DeleteIcon />
                                        </IconButton> :
                                        null
                                }
                            >
                                <ListItemAvatar>
                                    {/* <Avatar>
                                    <FolderIcon />
                                </Avatar> */}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={category.name}
                                />
                            </ListItem>);
                        })}
                    </List>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

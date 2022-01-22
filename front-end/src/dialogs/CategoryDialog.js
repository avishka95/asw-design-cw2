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
import { FilledInput, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { getMonths } from 'src/utils/constants';
import useHttp from '../utils/http';
import { APP_CONFIG } from 'src/config';

const ACTIONS = {
    SET_NAME: 'SET_NAME',
    HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
    switch (action.type) {
        case ACTIONS.SET_NAME:
            return { ...curTrasactionState, name: action.name }
        default:
            throw new Error('Should not get here');
    }
}

export default function CategoryDialog(props) {
    //   const [open, setOpen] = useState(false);
    const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
    const [{ name }, dispatchTransactions] = useReducer(transactionsReducer,
        { name: "" });

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

    useEffect(() => {

    }, [props.open])

    useEffect(() => {
        switch (reqExtra) {
          case APP_CONFIG.APIS.CREATE_CATEGORY:
            if (data) {
                props.handleClose();
            } else if(error){
                
            }
            break;
          default:
            break;
        }
      }, [data, reqExtra, isOpen, isLoading, error]);

    return (
        <Dialog fullWidth maxWidth={"md"} open={props.open}>
            <DialogTitle>New Category</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-category">Name</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-category"
                        value={name}
                        onChange={handleName}
                        label="Name"
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button variant="contained" disabled={!name} onClick={props.handleClose}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

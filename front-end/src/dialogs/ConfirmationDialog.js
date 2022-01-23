import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    props.handleConfirmation()
  };

  const handleAction = () => {
    props.data.action();
    handleClose();
  };

  useEffect(()=>{

  },[props.data])

  return (
      <Dialog
      fullWidth
      maxWidth="sm"
        open={Boolean(props.data)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm action
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {props.data?.message ? props.data.message : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {props.data?.action &&  <Button  variant="contained" onClick={handleAction} autoFocus>
            Confirm
          </Button>}
        </DialogActions>
      </Dialog>
  );
}

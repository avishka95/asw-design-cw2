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

  useEffect(()=>{

  },[props.data])

  return (
      <Dialog
        open={Boolean(props.data)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.data?.message ? props.data.message : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {props.data?.action &&  <Button onClick={props.data.action} autoFocus>
            Confirm
          </Button>}
        </DialogActions>
      </Dialog>
  );
}

import { Alert, Snackbar, SnackbarContent } from '@mui/material';
import React, { useState, useEffect } from 'react';

export default function ConsecutiveSnackbars(props) {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  useEffect(() => {
    if(props.snackbar){
      handleSnackbar(props.snackbar);
    }
  }, [props.snackbar]);

  const handleSnackbar = (snackbar) => {
    if (snackbar) {
      var message = snackbar.message;
      var severity = snackbar.severity;
      setSnackPack((prev) => [...prev, { message, severity, key: new Date().getTime() }]);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (!snackPack.length ){
      props.handleSnackbar(null);
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        {messageInfo && messageInfo.severity ?
          <Alert variant="filled" onClose={handleClose} severity={messageInfo.severity} sx={{ width: '100%' }}>
            {messageInfo.message}
          </Alert>
          :
          <SnackbarContent message={messageInfo ? messageInfo.message : ""} />}
      </Snackbar>
    </div>
  );
}

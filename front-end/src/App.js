import { useState } from 'react';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import ConsecutiveSnackbars from './components/Snackbar';
import AppContext from './context/AppContext';
import ConfirmationDialog from './dialogs/ConfirmationDialog';

// ----------------------------------------------------------------------

export default function App() {
  const [snackbar, setSnackbar] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const handleConfirmation = (message, action) => {
    if (message && action) {
      
      setConfirmation({ message, action });
    } else {
      setConfirmation(null);
    }
  };

  const handleSnackbar = (message, severity) => {
    if (message) {
      setSnackbar({ message, severity });
    } else {
      setSnackbar(null);
    }
  };


  return (
    <ThemeConfig>
      <AppContext.Provider value={{
        handleSnackbar: handleSnackbar,
        handleConfirmation: handleConfirmation
      }}>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
        <ConsecutiveSnackbars snackbar={snackbar} handleSnackbar={handleSnackbar} />
        <ConfirmationDialog data={confirmation} handleConfirmation={handleConfirmation}/>
      </AppContext.Provider>
    </ThemeConfig>
  );
}

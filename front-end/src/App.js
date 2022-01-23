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

// ----------------------------------------------------------------------

export default function App() {
  const [snackbar, setSnackbar] = useState({ message: "TEST", severity: "error" });


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
        handleSnackbar: handleSnackbar
      }}>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
        <ConsecutiveSnackbars snackbar={snackbar} handleSnackbar={handleSnackbar} />
      </AppContext.Provider>
    </ThemeConfig>
  );
}

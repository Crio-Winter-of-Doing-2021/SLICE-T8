import React from 'react';
import Home from './layout/Home/Home';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'myFont',
  },
  palette: {
    primary: {
      main: '#583e81'
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
import React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';

import Signup from './signup';
import Profile from './profile';
import Slots from './slots';
import Transactions from './transactions';
import Donate from './donate';
import CreateSlot from './createslot';
import RequestDonation from './requestdonation';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const App = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <TabContext value={value}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Login / Sign Up" value="1" />
            <Tab label="Profile" value="2" />
            <Tab label="Slots" value="3" />
            <Tab label="Transactions" value="4" />
            <Tab label="Donate" value="5" />
            <Tab label="Create Slot" value="6" />
            <Tab label="Request Donation" value="7" />
          </TabList>
        </AppBar>

        <TabPanel value="1"><Signup /></TabPanel>
        <TabPanel value="2"><Profile /></TabPanel>
        <TabPanel value="3"><Slots /></TabPanel>
        <TabPanel value="4"><Transactions /></TabPanel>
        <TabPanel value="5"><Donate /></TabPanel>
        <TabPanel value="6"><CreateSlot /></TabPanel>
        <TabPanel value="7"><RequestDonation /></TabPanel>

      </TabContext>
    </div>
  );
}


export default App;



/*




const pageone = () => {
    return(
        <div>
            <Button variant="contained" color="primary">Primary</Button>
            <Link to="/"> click this </Link>
        </div>
    );
}

const App = () => {
    return(
        <div>
            <BrowserRouter>
                <div>
                    <Route path = "/" exact component={pageone} />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;


*/
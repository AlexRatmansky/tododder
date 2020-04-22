import React, { Component } from 'react';
import Account from '../../components/Account';
import Todo from '../../components/Todo';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { authMiddleWare } from '../../util/auth';
import { styles } from './style';

class Home extends Component {
  state = {
    render: false,
  };

  loadAccountPage = () => {
    this.setState({ render: true });
  };

  loadTodoPage = () => {
    this.setState({ render: false });
  };

  logoutHandler = () => {
    localStorage.removeItem('AuthToken');
    this.props.history.push('/login');
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      uiLoading: true,
      imageLoading: false,
    };
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem('AuthToken');

    fetch('/user', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({
          firstName: response.userCredentials.firstName,
          lastName: response.userCredentials.lastName,
          email: response.userCredentials.email,
          phoneNumber: response.userCredentials.phoneNumber,
          country: response.userCredentials.country,
          username: response.userCredentials.username,
          uiLoading: false,
        });
      })
      .catch(error => {
        if (error.status === 403) {
          this.props.history.push('/login');
        }
        console.log(error);
        this.setState({ errorMsg: 'Error in retrieving the data' });
      });
  };

  render() {
    const { classes } = this.props;
    if (this.state.uiLoading === true) {
      return (
        <div className={classes.root}>
          {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                {'TodoApp'}
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <div style={{ textAlign: 'center' }}>
              <p>
                {this.state.firstName} {this.state.lastName}
              </p>
            </div>
            <Divider />
            <List>
              <ListItem button key="Todo" onClick={this.loadTodoPage}>
                <ListItemIcon>
                  {' '}
                  <NotesIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Todo" />
              </ListItem>

              <ListItem button key="Account" onClick={this.loadAccountPage}>
                <ListItemIcon>
                  {' '}
                  <AccountBoxIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>

              <ListItem button key="Logout" onClick={this.logoutHandler}>
                <ListItemIcon>
                  {' '}
                  <ExitToAppIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>

          <div>{this.state.render ? <Account /> : <Todo />}</div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Home);

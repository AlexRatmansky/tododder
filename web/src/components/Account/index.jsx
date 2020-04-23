import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Button, Card, CardActions, CardContent, Divider, Grid, TextField } from '@material-ui/core'
import { authMiddleWare } from '../../util/auth'
import { styles } from './style'

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      country: '',
      uiLoading: true,
      buttonLoading: false,
      imageError: '',
    }
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history)
    const authToken = localStorage.getItem('AuthToken')

    fetch('/user', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        this.setState({
          firstName: response.userCredentials.firstName,
          lastName: response.userCredentials.lastName,
          email: response.userCredentials.email,
          phoneNumber: response.userCredentials.phoneNumber,
          country: response.userCredentials.country,
          username: response.userCredentials.username,
          uiLoading: false,
        })
      })
      .catch(error => {
        if (error.status === 403) {
          this.props.history.push('/login')
        }
        console.log(error)
        this.setState({ errorMsg: 'Error in retrieving the data' })
      })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  updateFormValues = event => {
    event.preventDefault()
    this.setState({ buttonLoading: true })
    authMiddleWare(this.props.history)
    const authToken = localStorage.getItem('AuthToken')

    const formRequest = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      country: this.state.country,
    }

    fetch('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(formRequest),
    })
      .then(response => response.json())
      .then(() => {
        this.setState({ buttonLoading: false })
      })
      .catch(error => {
        if (error.status === 403) {
          this.props.history.push('/login')
        }
        console.log(error)
        this.setState({
          buttonLoading: false,
        })
      })
  }

  render() {
    const { classes, ...rest } = this.props
    if (this.state.uiLoading === true) {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
        </main>
      )
    } else {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Card {...rest} className={classes.root}>
            <CardContent>
              <div className={classes.details}>
                <div>
                  <Typography className={classes.locationText} gutterBottom variant="h4">
                    {this.state.firstName} {this.state.lastName}
                  </Typography>
                </div>
              </div>
              <div className={classes.progress} />
            </CardContent>
            <Divider />
          </Card>

          <br />
          <Card {...rest} className={classes.root}>
            <form autoComplete="off" noValidate>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="First name"
                      margin="dense"
                      name="firstName"
                      variant="outlined"
                      value={this.state.firstName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Last name"
                      margin="dense"
                      name="lastName"
                      variant="outlined"
                      value={this.state.lastName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      margin="dense"
                      name="email"
                      variant="outlined"
                      disabled={true}
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      margin="dense"
                      name="phone"
                      type="number"
                      variant="outlined"
                      disabled={true}
                      value={this.state.phoneNumber}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="User Name"
                      margin="dense"
                      name="userHandle"
                      disabled={true}
                      variant="outlined"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Country"
                      margin="dense"
                      name="country"
                      variant="outlined"
                      value={this.state.country}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions />
            </form>
          </Card>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            className={classes.submitButton}
            onClick={this.updateFormValues}
            disabled={this.state.buttonLoading || !this.state.firstName || !this.state.lastName || !this.state.country}
          >
            {'Save details'}
            {this.state.buttonLoading && <CircularProgress size={30} className={classes.progress} />}
          </Button>
        </main>
      )
    }
  }
}

export default withStyles(styles)(Account)

import React, { useEffect, useState } from 'react'
import Account from '../../components/Account'
import { Todo } from '../../components/Todo'
import { authMiddleWare } from '../../util/auth'
import { Button, Navbar, Classes, NavbarDivider, NavbarGroup, NavbarHeading, Spinner } from '@blueprintjs/core'

export const Home = props => {
  const [render, setRender] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [uiLoading, setUiLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState({})

  useEffect(() => {
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')

    fetch('/user', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => {
        if (!response.ok) throw response
        return response.json()
      })
      .then(response => {
        console.log(response)
        setFirstName(response.userCredentials.firstName)
        setLastName(response.userCredentials.lastName)
        setUiLoading(false)
      })
      .catch(error => {
        if (error.status === 403) {
          props.history.push('/login')
        }
        error.json().then(errorMessage => {
          console.log(errorMessage)
          setErrorMsg({ errorMsg: 'Error in retrieving the data' })
        })
      })
  }, [props.history])

  const loadAccountPage = () => {
    setRender(true)
  }

  const loadTodoPage = () => {
    setRender(false)
  }

  const logoutHandler = () => {
    localStorage.removeItem('AuthToken')
    props.history.push('/login')
  }

  return uiLoading ? (
    <Spinner size={150} />
  ) : (
    <div>
      <h1>{'TodoApp'}</h1>
      <p>
        {firstName} {lastName}
      </p>

      <Navbar>
        <NavbarGroup>
          <NavbarHeading>{'Tododder'}</NavbarHeading>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="list" text="Todo List" onClick={loadTodoPage} />
          <Button className={Classes.MINIMAL} icon="document" text="Account" onClick={loadAccountPage} />
          <Button className={Classes.MINIMAL} icon="document" text="Logout" onClick={logoutHandler} />
        </NavbarGroup>
      </Navbar>

      {errorMsg && (
        <div>
          {Object.keys(errorMsg).map(key => (
            <div>
              <div>
                {'key:'} {key}
              </div>
              <div>
                {'value:'} {errorMsg[key]}
              </div>
            </div>
          ))}
        </div>
      )}

      <div>{render ? <Account /> : <Todo />}</div>
    </div>
  )
}

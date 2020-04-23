import React, { useEffect, useState } from 'react'
import { authMiddleWare } from '../../util/auth'
import { Button, Card, FormGroup, H1, H2, InputGroup, Intent, Spinner } from '@blueprintjs/core'

export const Todo = props => {
  const [todos, setTodos] = useState([])
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [todoId, setTodoId] = useState('')
  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)
  const [uiLoading, setUiLoading] = useState(true)
  const [buttonType, setButtonType] = useState('')
  const [viewOpen, setViewOpen] = useState(false)

  useEffect(() => {
    authMiddleWare(props.history)

    const authToken = localStorage.getItem('AuthToken')

    fetch('/todos', {
      headers: {
        Authorization: authToken,
      },
    })
      .then(response => response.json())
      .then(response => {
        setTodos(response)
        setUiLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [props.history])

  const handleChangeTitle = event => {
    setTitle(event.target.value)
  }

  const handleChangeBody = event => {
    setBody(event.target.value)
  }

  const deleteTodoHandler = data => {
    authMiddleWare(props.history)
    const authToken = localStorage.getItem('AuthToken')

    let todoId = data.todo.todoId

    fetch(`todo/${todoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authToken,
      },
    })
      .then(() => {
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleEditClickOpen = data => {
    setTitle(data.todo.title)
    setBody(data.todo.body)
    setTodoId(data.todo.todoId)
    setButtonType('Edit')
    setOpen(true)
  }

  const handleViewOpen = data => {
    setTitle(data.todo.title)
    setBody(data.todo.body)
    setViewOpen(true)
  }

  const handleClickOpen = () => {
    setTodoId('')
    setTitle('')
    setBody('')
    setButtonType('')
    setOpen(true)
  }

  const handleSubmit = event => {
    event.preventDefault()

    authMiddleWare(props.history)

    const userTodo = { title, body }

    const authToken = localStorage.getItem('AuthToken')

    fetch(buttonType === 'Edit' ? `/todo/${todoId}` : '/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(userTodo),
    })
      .then(response => response.json())
      .then(() => {
        setOpen(false)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        setOpen(true)
        setErrors(error.response.data)
      })
  }

  const handleViewClose = () => {
    setViewOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return uiLoading ? (
    <Spinner size={150} />
  ) : (
    <main>
      <Button type={'submit'} onClick={handleClickOpen}>
        {'Add Todo'}
      </Button>

      {open && (
        <div>
          <div>
            <H1>{buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}</H1>
          </div>

          <form>
            <FormGroup
              helperText={errors.title}
              intent={errors.title ? Intent.WARNING : Intent.NONE}
              label={'Todo Title'}
              labelFor={'email'}
            >
              <InputGroup
                id={'todoTitle'}
                name={'title'}
                intent={errors.title ? Intent.WARNING : Intent.NONE}
                required
                value={title}
                onChange={handleChangeTitle}
              />
            </FormGroup>

            <FormGroup
              helperText={errors.body}
              intent={errors.body ? Intent.WARNING : Intent.NONE}
              label={'Todo Details'}
              labelFor={'body'}
            >
              <InputGroup
                id={'todoDetails'}
                name={'body'}
                intent={errors.body ? Intent.WARNING : Intent.NONE}
                required
                value={body}
                onChange={handleChangeBody}
              />
            </FormGroup>
          </form>

          <Button onClick={handleClose}>{'Cancel'}</Button>
          <Button onClick={handleSubmit}>{buttonType === 'Edit' ? 'Save' : 'Submit'}</Button>
        </div>
      )}

      {todos.map(todo => (
        <Card key={todo.todoId}>
          <p>{todo.title}</p>
          <p>{todo.createdAt}</p>
          <p>{todo.body}</p>
          <Button onClick={() => handleViewOpen({ todo })}>{'View'}</Button>
          <Button onClick={() => handleEditClickOpen({ todo })}>{'Edit'}</Button>
          <Button onClick={() => deleteTodoHandler({ todo })}>{'Delete'}</Button>
        </Card>
      ))}

      {viewOpen && (
        <div>
          <Button onClick={handleViewClose}>{'Close'}</Button>
          <H2>{title}</H2>
          <p>{body}</p>
        </div>
      )}
    </main>
  )
}

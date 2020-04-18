import { Request, Response } from 'express';
import { db } from '../util/admin';

interface Todo {
  todoId: string;
  title: string;
  body: string;
  createdAt: string;
}

type Todos = Array<Todo>;

export const getAllTodos = (request: Request, response: Response) => {
  db.collection('todos')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      const todos: Todos = [];

      data.forEach(doc => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });

      return response.json(todos);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

export const postOneTodo = (request: Request, response: Response) => {
  if (request.body.body.trim() === '') {
    return response.status(400).json({ body: 'Must not be empty' });
  }

  if (request.body.title.trim() === '') {
    return response.status(400).json({ title: 'Must not be empty' });
  }

  const newTodoItem = {
    id: '',
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  };

  db.collection('todos')
    .add(newTodoItem)
    .then(doc => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: 'Something went wrong' });
    });
};

export const deleteTodo = (request: Request, response: Response) => {
  const todo = db.collection('todos').doc(request.params.todoId);

  todo
    .get()
    .then(doc => {
      if (!doc.exists) {
        response.status(404).json({ error: 'Todo not found' });
      }
      return todo.delete();
    })
    .then(() => {
      response.json({ message: 'Delete successful' });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

export const editTodo = (request: Request, response: Response) => {
  if (request.body.todoId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit' });
  }

  const todo = db.collection('todos').doc(request.params.todoId);

  todo
    .update(request.body)
    .then(() => {
      response.json({ message: 'Updated successfully' });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};

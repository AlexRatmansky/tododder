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

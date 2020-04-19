import * as functions from 'firebase-functions';
import { deleteTodo, editTodo, getAllTodos, postOneTodo } from './api/todos';
import { loginUser, signUpUser } from './api/users';

const app = require('express')();

// Users
app.post('/signup', signUpUser);
app.post('/login', loginUser);

// Todos
app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.post('/todo/:todoId', editTodo);
app.delete('/todo/:todoId', deleteTodo);

export const api = functions.https.onRequest(app);

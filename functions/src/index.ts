import * as functions from 'firebase-functions';
import { deleteTodo, editTodo, getAllTodos, postOneTodo } from './api/todos';
import { getUserDetail, loginUser, signUpUser, updateUserDetails } from './api/users';
import { auth } from './util/auth';

const app = require('express')();

// Users
app.post('/signup', signUpUser);
app.post('/login', loginUser);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

// Todos
app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, postOneTodo);
app.post('/todo/:todoId', auth, editTodo);
app.delete('/todo/:todoId', auth, deleteTodo);

export const api = functions.https.onRequest(app);

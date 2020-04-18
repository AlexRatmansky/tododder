import * as functions from 'firebase-functions';
import { deleteTodo, editTodo, getAllTodos, postOneTodo } from './api/todos';

const app = require('express')();

app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.post('/todo/:todoId', editTodo);
app.delete('/todo/:todoId', deleteTodo);

export const api = functions.https.onRequest(app);

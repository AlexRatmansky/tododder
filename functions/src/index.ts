import * as functions from 'firebase-functions';
import { getAllTodos } from './api/todos';

const app = require('express')();

app.get('/todos', getAllTodos);

export const api = functions.https.onRequest(app);

import express from 'express';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';
const app = express();
databaseService.connect();
const PORT = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());
app.use('/users', usersRouter);

// Error handler
app.use(defaultErrorHandler);

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

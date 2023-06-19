import express from 'express';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
const app = express();
const PORT = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());
app.use('/users', usersRouter);
databaseService.connect();
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

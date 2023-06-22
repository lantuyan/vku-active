import express, { Request, Response, NextFunction } from 'express';
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
// Erorr handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.log(err.message);
  res.status(404).json({
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

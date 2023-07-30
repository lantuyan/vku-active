import express from 'express';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import path from 'path';
import adminRouter from './routes/admin.routes';
const app = express();
databaseService.connect();
const PORT = 3000;
import methodOverride from 'method-override';
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/admin', adminRouter);

// app.use(methodOverride('_method'));
app.use('/users', usersRouter);

// Error handler
app.use(defaultErrorHandler);

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

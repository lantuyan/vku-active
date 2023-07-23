import { Router } from 'express';
import { getallActivitiesController } from '~/controllers/admin.controller';
import { wrapRequestHandler } from '~/utils/handlers';

const adminRouter = Router();

// adminRouter.get('/activity', async (req, res) => {
//   // console.log(path.join(__dirname, 'views'));
//   console.log('getallActivity');
//   const result = await adminService.getAllActivity();
//   console.log(result);
//   return res.json({
//     message: 'getallActivity',
//     result: result
//   });
//   res.render('admin/index.ejs', { title: 'Admin' });
// });
// import express from 'express';
// const usersRouter = express.Router();

adminRouter.get('/AllActivity', wrapRequestHandler(getallActivitiesController));

export default adminRouter;

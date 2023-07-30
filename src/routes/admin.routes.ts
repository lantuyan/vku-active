import { Router } from 'express';
import {
  createActivityController,
  getallActivitiesController,
  newFormController
} from '~/controllers/admin.controller';
import { wrapRequestHandler } from '~/utils/handlers';
import express from 'express';
import adminService from '~/services/admin.services';
const adminRouter = Router();

// adminRouter.get('/activity', async (req, res) => {
//   // console.log(path.join(__dirname, 'views'));
//   console.log('getallActivity');
//   const result = await adminService.getAllActivities();
//   console.log(result);
//   return res.json({
//     message: 'getallActivity',
//     result: result
//   });
//   res.render('admin/index.ejs', { title: 'Admin' });
// });

adminRouter.get('/activities', wrapRequestHandler(getallActivitiesController));

adminRouter.get('/activities/new', wrapRequestHandler(newFormController));

adminRouter.post('/activities', wrapRequestHandler(createActivityController));

export default adminRouter;

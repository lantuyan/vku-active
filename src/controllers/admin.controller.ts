import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import adminService from '~/services/admin.services';
import path from 'path';
export const getallActivitiesController = async (req: Request, res: Response, next: NextFunction) => {
  const activities = await adminService.getAllActivities();
  if (!activities) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.ACTIVITY_NOT_FOUND
    });
  }
  // return res.json({
  //   message: USERS_MESSAGES.GET_ACTIVITY_INFO_SUCCESS,
  //   result: activities
  // });
  return res.render('admin/index.ejs', { activities: activities });
};

export const newFormController = async (req: Request, res: Response, next: NextFunction) => {
  return res.render('admin/new.ejs');
};

export const createActivityController = async (req: Request, res: Response, next: NextFunction) => {
  const { code, name, activityLatitude, activityLongitude, score, location, start_time, end_time } = req.body;
  console.log(req.body);
  const activity = await adminService.createActivity({
    code,
    name,
    activityLatitude,
    activityLongitude,
    score,
    location,
    start_time,
    end_time
  });
  console.log(activity);
  if (!activity) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.ACTIVITY_NOT_FOUND
    });
  }
  // return res.json({
  //   message: USERS_MESSAGES.GET_ACTIVITY_INFO_SUCCESS,
  //   result: activity
  // });
  return res.redirect('/admin/activities');
};

import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import adminService from '~/services/admin.services';

export const getallActivitiesController = async (req: Request, res: Response, next: NextFunction) => {
  const activities = await adminService.getAllActivities();
  if (!activities) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.ACTIVITY_NOT_FOUND
    });
  }
  return res.json({
    message: USERS_MESSAGES.GET_ACTIVITY_INFO_SUCCESS,
    result: activities
  });
};
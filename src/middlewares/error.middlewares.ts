import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '../constants/httpStatus'
import { omit } from 'lodash'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //lỗi từ các nơi sẽ dồn về đây
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, ['status']))
  }
  //nếu mà lỗi xuống đc đây thì nghĩa là lỗi mặc định
  //set name, stack, message về enumerable true
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}

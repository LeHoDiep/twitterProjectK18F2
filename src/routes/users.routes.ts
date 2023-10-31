import { Router } from 'express'
import {
  emailVerifyTokenController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRoute.get('/login', loginValidator, wrapAsync(loginController))

/*
Description: Register new user
Path: /register
Method: POST
body:{
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string theo chuẩn ISO 8601
}
*/
usersRoute.post('/register', registerValidator, wrapAsync(registerController))

/*
des: đăng xuất
path: /users/logout
method: POST
headers: {Authorization: 'Bearer <access_token>'}
body: {refresh_token: string}
*/
usersRoute.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
des: verify email token
khi người dùng đăng ký họ sẽ nhận đc mail có link dạng
http://localhost:3000/users/verify-email?token=<email_verify_token>
nếu mà em nhấp vào link thì sẽ tạo ra req gữi lên email_verify_token lên server
server kiểm tra email_verify_token có hợp lệ hay không ?
thì từ decoded_email_verify_token lấy ra user_id
và vào user_id đó để update email_verify_token thành '', verify = 1, update_at
path: /users/verify-email
method: POST
body: {email_verify_token: string}
*/
usersRoute.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))

/*
des: resend email verify token
khi mail thất lạc , hoặc email_verify_token hết hạn, thì người dùng có 
nhu cầu resend email_verify_token

method: post
path: /users/resend-verify-email
headers: {Authorization : "Bearer <access_token>"} // đăng nhập mới đc resend
body: {}
*/

usersRoute.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
des: khi người dùng quên mật khẩu, họ gữi email để xin mình tạo cho họ forgot_password_token
path: /users/forgot-password
method: POST
body: {email: string}
*/
usersRoute.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: khi người dùng nhấp vào link trong email để reset password
họ sẽ gữi 1 req kèm theo forgot_password_token lên server
server sẽ kiểm tra forgot_password_token có hợp lệ hay không ?
sau đó chuyển hướng người dùng đến trang reset password
path: /users/verify-forgot-password
method: POST
body: {forgot_password_token: string}
*/
usersRoute.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default usersRoute

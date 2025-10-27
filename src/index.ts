import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import Auth from './api/auth/auth.routes'
import User from './api/user/user.route'

const router = Router()

router.use('/auth/', Auth)
router.use('/user/', User)

router.use((_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: 'Resource does not exist',
    data: null
  })
})

export default router
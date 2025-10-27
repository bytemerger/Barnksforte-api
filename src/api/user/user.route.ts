import { Router } from 'express';
import authenticate from '../../middleware/internal-auth';
import Controller from './user.controller'
import * as validation from './user.validation'
import userAuth from '../../middleware/user-auth';

const router = Router();
const controller = new Controller();

const authMiddlewares = [authenticate, userAuth]

router.use(...authMiddlewares)

router.get('/', controller.getUsers);

// user management routes
router.put('/:id/password', validation.updateUserPassword, controller.updateUserPassword);

// posts
router.get('/:id/shared-posts', controller.getUserSharedPosts);
router.post('/:id/posts', validation.createPost, controller.createPost);
router.get('/:id/posts', controller.getUserPosts);
router.get('/:id/posts/:postId', controller.getUserPost); 
router.delete('/:id/posts/:postId', controller.deleteUserPost);

export default router;
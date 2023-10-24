import express from 'express';
import validate from '../middlewares/validate';
import { userValidation } from '../validations';
import { userController } from '../controllers';

const router = express.Router();

router
    .route('/')
    .get(validate(userValidation.getUsers), userController.getUsers)
    .post(validate(userValidation.createUser), userController.createUser);

router
    .route('/getUsersByName')
    .get(validate(userValidation.getUsersByName), userController.getUsersByName);

router
    .route('/getUsersByEmail')
    .get(validate(userValidation.getUsersByEmail), userController.getUsersByEmail);

router
    .route('/:userId/group')
    .delete(validate(userValidation.removeUserFromGroup), userController.removeUserFromGroup);

router.route('/createGroup').post(validate(userValidation.createGroup), userController.createGroup);

export default router;

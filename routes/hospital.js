import { Router } from 'express';
import {
  signin,
  deleteAccount,
  signup,
  signout,
  updateAccount,
  requestsCount,
  updatePassword,
} from '../controllers/hospital.js';

const hospitalRouter = Router();

hospitalRouter.post('/signup', signup);
hospitalRouter.post('/signin', signin);
hospitalRouter.put('/update-account', updateAccount);
hospitalRouter.put('/update-password', updatePassword);
hospitalRouter.post('/delete-account', deleteAccount);
hospitalRouter.post('/signout', signout);
hospitalRouter.post('/requests-count', requestsCount);

export default hospitalRouter;

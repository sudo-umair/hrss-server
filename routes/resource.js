import { Router } from 'express';
import {
  postRequest,
  fetchRequests,
  approveRequest,
  deleteRequest,
  hideRequest,
  totalNumberOfRequests,
} from '../controllers/resource.js';

const resourceRouter = Router();

resourceRouter.post('/postRequest', postRequest);
resourceRouter.post('/fetchRequests', fetchRequests);
resourceRouter.put('/approveRequest', approveRequest);
resourceRouter.post('/deleteRequest', deleteRequest);
resourceRouter.put('/hideRequest', hideRequest);
resourceRouter.post('/totalNumberOfRequests', totalNumberOfRequests);

export default resourceRouter;

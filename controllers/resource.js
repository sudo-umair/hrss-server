import Resource from '../models/Resource.js';
import { sendNotificationToUser } from '../utils/appNotifications.js';

export const postRequest = (req, res) => {
  const {
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
    resourceNotes,
  } = req.body;

  const newResource = new Resource({
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    resourceNotes,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
  });

  newResource
    .save()
    .then((result) => {
      res.send({
        status: '201',
        message: 'Request Posted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Request Failed to Post',
        error: err,
      });
    });
};

export const updateRequest = (req, res) => {
  const {
    id,
    resourceName,
    resourceQuantity,
    resourceDuration,
    resourceNotes,
  } = req.body;

  console.log(id);

  Resource.findById(id)
    .then((resource) => {
      console.log(resource);
      if (resource.requestStatus !== 'Pending') {
        const { approvedByName } = resource;
        res.send({
          status: '409',
          message: 'Request already approved by ' + approvedByName,
        });
      } else {
        Resource.findByIdAndUpdate(id, {
          resourceName,
          resourceQuantity,
          resourceDuration,
          resourceNotes,
        })
          .then((result) => {
            res.send({
              status: '200',
              message: 'Resource Request Updated',
            });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              status: '500',
              message: 'Failed to Update Resource Request',
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Resource Request Update Failed',
        error: err,
      });
    });
};

export const fetchOneRequest = (req, res) => {
  const { id } = req.params;
  console.log(id, 'ss');
  Resource.findById(id)
    .then((result) => {
      res.send({
        status: '200',
        message: 'Request Fetched',
        result: result,
      });
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Fetching Request Failed',
        error: err,
      });
    });
};

export const fetchRequests = (req, res) => {
  const { userType } = req.body;
  if (userType === 'user') {
    Resource.find({
      userType: 'user',
    })
      .then((result) => {
        res.send({
          status: '200',
          message: 'Requests Fetched',
          results: result,
        });
      })
      .catch((err) => {
        res.send({
          status: '500',
          message: 'Fetching Requests Failed',
          error: err,
        });
      });
  } else if (userType === 'hospital') {
    Resource.find({})
      .then((result) => {
        res.send({
          status: '200',
          message: 'Requests Fetched Successfully',
          results: result,
        });
      })
      .catch((err) => {
        res.send({
          status: '500',
          message: 'Fetching Requests Failed',
          error: err,
        });
      });
  }
};

export const totalNumberOfRequests = (req, res) => {
  const { email } = req.body;

  Resource.find({ requestedByEmail: email })
    .then((resources) => {
      res.send({
        status: '200',
        message: 'Requests Fetched Successfully',
        data: resources.length,
      });
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Fetching Requests Failed' });
    });
};

export const approveRequest = (req, res) => {
  const {
    id,
    requestStatus,
    approvedByName,
    approvedByEmail,
    approvedByPhone,
  } = req.body;

  Resource.findById(id)
    .then((resource) => {
      if (resource.requestStatus !== 'Pending') {
        const { approvedByName } = resource;
        res.send({
          status: '500',
          message: 'Request already approved by ' + approvedByName,
        });
      } else {
        Resource.findByIdAndUpdate(id, {
          requestStatus,
          approvedByName,
          approvedByPhone,
          approvedByEmail,
        })
          .then((result) => {
            const { resourceName, requestedByEmail, userType } = result;
            if (userType === 'user') {
              sendNotificationToUser(
                requestedByEmail,
                'Resource Request Approved',
                `Your request for ${resourceName} has been approved by ${approvedByName}`,
                '{"screen": "Resources"}'
              );
            }
            res.send({
              status: '200',
              message: 'Request Approved',
            });
          })
          .catch((err) => {
            res.send({
              status: '500',
              message: 'Failed to Approve Request',
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Request Approve Failed',
        error: err,
      });
    });
};

export const deleteRequest = async (req, res) => {
  const { id, email } = req.body;
  await Resource.findOne({
    _id: id,
    requestedByEmail: email,
  })
    .then((resource) => {
      if (resource.requestStatus === 'Pending') {
        Resource.findByIdAndDelete(id)
          .then((result) => {
            res.send({
              status: '200',
              message: 'Request Deleted',
            });
            console.log('that');
          })
          .catch((err) => {
            res.send({
              status: '500',
              message: 'Request Delete Failed',
              error: err,
            });
          });
        console.log('this');
      } else {
        res.send({
          status: '500',
          message: `Request Already Approved By ${resource.approvedByName}`,
        });
      }
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Request Delete Failed',
        error: err,
      });
    });
};

export const hideRequest = (req, res) => {
  const { id, email } = req.body;
  Resource.findOne({
    _id: id,
  })
    .then((resource) => {
      if (resource) {
        resource.ignoredBy.push(email);
        resource
          .save()
          .then((result) => {
            res.send({
              status: '200',
              message: 'Request Hidden',
            });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              status: '500',
              message: 'Hiding Request Failed',
              error: err,
            });
          });
      } else {
        res.send({
          status: '500',
          message: 'Resource Request Not Found',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Hiding Request Failed',
        error: err,
      });
    });
};

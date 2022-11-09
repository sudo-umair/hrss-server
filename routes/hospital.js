import dotenv from 'dotenv';
dotenv.config();
import expresss from 'express';
import Hospital from '../models/Hospital.js';
import bcrypt from 'bcryptjs';
import Authenticate from '../middleware/Authenticate.js';

const hospitalRouter = expresss.Router();

hospitalRouter.post('/Signup', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const address = req.body.address;

    const preHospital = await Hospital.findOne({ email });

    if (!preHospital) {
      const addHospital = new Hospital({
        name: name,
        email: email,
        password: password,
        contact: contact,
        address: address,
      });
      await addHospital.save();
      res.send({ status: 200, Message: 'Signup Successful' });
    } else {
      res.send({ Message: 'Username already Exist' });
    }
  } catch (err) {
    res.send({ Message: 'Error in Signup' });
    console.log(err);
  }
});

hospitalRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing_user = await Hospital.findOne({ email });

    if (existing_user) {
      const isMatch = await bcrypt.compare(password, existing_user.password);
      const token = await existing_user.generateToken();
      console.log('Hello from login router', token);
      res.cookie('jwtoken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 500000000),
      });
      if (isMatch) {
        // console.log(existing_user);
        // res.send(200, { message: "Login Successfull", user: existing_user });
        res.send({
          status: 200,
          message: 'Login Successfull',
          user: existing_user,
        });
      } else {
        res.send({ status: 400, error: "Password didn't match" });
        // res.send({ status: 400, error: "Password didn't match" })
      }
    } else {
      res.send({ status: 403, error: 'Account does not exist' });
    }
  } catch (error) {
    res.send(error);
  }
});

hospitalRouter.get('/Dashboard', Authenticate, async (req, res, next) => {
  // hospitalRouter.use(cookieParser)
  // Authenticate();
  try {
    console.log('hello');
    res.send();
  } catch (error) {
    res.send(error);
  }
});

export default hospitalRouter;

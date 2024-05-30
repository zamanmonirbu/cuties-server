import express from 'express';
import {loginUser, registerUser} from '../Controllers/AuthControllers.js'; // Ensure the path is correct


const router = express.Router();

router.get('/', (req, res) => {
  res.send("I am auth");
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

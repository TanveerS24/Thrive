import express from 'express';

import createUser from '../../controllers/user/createUser.controller.js';
import loginUser from '../../controllers/user/login.controller.js';
import logout from '../../controllers/user/logout.controller.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logout);

export default router;
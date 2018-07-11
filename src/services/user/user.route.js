const jsonWebToken = require('../../core/jsonWebToken');
const userService = require('./user.service');
const HttpStatusCodes = require('http-status-codes');

module.exports = (app) => {
  /**
   * @swagger
   * /users/login:
   *   post:
   *     tags:
   *       - Users
   *     summary: Login an User
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - email
   *             - password
   *           properties:
   *             email:
   *               type: string
   *             password:
   *               type: string
   *           example: {
   *             "email": "user@user.user",
   *             "password": "user"
   *           }
   *     responses:
   *       200:
   *         description: OK
   *         schema: 
   *           type: Object
   *           properties: 
   *             id:
   *               type: integer
   *             name:
   *               type: string
   *             email:
   *               type: string
   *             createdAt:
   *               type: date
   *             updatedAt:
   *               type: date
   *           example: {
   *             "id": 1,
   *             "name": "user",
   *             "email": "user@user.user",
   *             "createdAt": "2018-01-02T20:14:22.527Z",
   *             "updatedAt": "2018-01-02T20:14:22.527Z"
   *           }
   *       404:
   *         description: Not Found
   */
  app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userService.verifyCredentialsAsync(email, password);
    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).send();
    }
    const token = jsonWebToken.generateToken(user.id);
    res.set('Authorization', token);
    delete user.dataValues.password;
    res.status(HttpStatusCodes.OK).json(user);
  });

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *       - Users
   *     summary: Creates an User
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - email
   *             - password
   *           properties:
   *             name:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *           example: {
   *             "name": "user",
   *             "email": "user@user.user",
   *             "password": "user"
   *           }
   *     responses:
   *       201:
   *         description: CREATED
   *         headers:
   *           Location:
   *             schema:
   *               type: string
   *             description: Endpoint to get the created User
   *             example: {
   *               "Location": "/users/secret"
   *             }
   *       default:
   *         description: Error creating User
   */
  app.post('/', async (req, res) => {
    try {
      const user = await userService.createAsync(req.body);
      res.set('Location', `${req.baseUrl}/${user.id}`);
      return res.status(HttpStatusCodes.CREATED).send();
    } catch (err) {
      return res.status(HttpStatusCodes.NOT_ACCEPTABLE).json((err && err.message) || global.__('user_unauthorized'));
    }
  });

  /**
   * @swagger
   * /users/refresh:
   *   get:
   *     tags:
   *       - Users
   *     summary: Validate user token
   *     consumes:
   *       - application/json
   *     responses:
   *       204:
   *         description: NO CONTENT
   *       401:
   *         description: Unauthorized
   */
  app.get('/refresh', jsonWebToken.authenticate, async (req, res) => {
    res.status(HttpStatusCodes.NO_CONTENT).send();
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Show an User
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   *         schema: 
   *           type: Object
   *           properties: 
   *             id:
   *               type: integer
   *             name:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *             createdAt:
   *               type: date
   *             updatedAt:
   *               type: date
   *           example: {
   *             "id": 1,
   *             "name": "user",
   *             "email": "user@user.user",
   *             "createdAt": "2018-01-02T20:14:22.527Z",
   *             "updatedAt": "2018-01-02T20:14:22.527Z"
   *           }
   *       404: 
   *         description: User not found
   */
  app.get('/', jsonWebToken.authenticate, async (req, res) => {
    delete req.user.password;
    return res.json(req.user);
  });

  /**
   * @swagger
   * /users:
   *   put:
   *     tags:
   *       - Users
   *     summary: Updates an User
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         in: header
   *       - name: body
   *         in: body
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             password:
   *               type: string
   *           example: {
   *             "name": "user",
   *             "password": "1234"
   *           }
   *     responses:
   *       204:
   *         description: NO CONTENT
   *       404:
   *         description: User not found
   *       406:
   *         description: Error updating User
   */
  app.put('/', jsonWebToken.authenticate, async (req, res) => {
    try {
      const name = req.body.name;
      const password = req.body.password;

      const user = {
        name, password
      };

      const updatedUser = await userService.updateAsync(req.user.id, user);
      if (!updatedUser) {
        return res.status(HttpStatusCodes.NOT_FOUND).json(global.__('user_not_found'));
      }
      return res.status(HttpStatusCodes.NO_CONTENT).send();
    } catch (err) {
      return res.status(HttpStatusCodes.NOT_ACCEPTABLE).json((err && err.message) || global.__('user_put_error'));
    }
  });
};

const jsonWebToken = require('../../core/jsonWebToken');
const userService = require('./user.service');
const HttpStatusCodes = require('http-status-codes');

module.exports = (app) => {
  /**
   * @swagger
   * /users/token:
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
   *         headers:
   *           token:
   *            type: string
   *            description: token auth
   *         schema: 
   *           type: Object
   *           properties: 
   *             token:
   *               type: string
   *           example: {
   *             "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.KnEu3gcxllBIxfmOrkWjMPBF06exTeLDURXcFqN6gUw"
   *           }
   *       default:
   *         description: Error creating User
   */
  app.post('/token', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userService.verifyCredentialsAsync(email, password);
    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).send();
    }
    const token = jsonWebToken.generateToken(user.id);
    res.set('token', token);
    res.json({ token });
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
      await userService.createAsync(req.body);
      res.set('Location', 'secret');
      return res.status(HttpStatusCodes.CREATED).send();
    } catch (err) {
      return res.status(HttpStatusCodes.NOT_ACCEPTABLE).json((err && err.message) || global.__('user_unauthorized'));
    }
  });

  /**
   * @swagger
   * /users/test:
   *   get:
   *     tags:
   *       - Users
   *     summary: Simple authentication test
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   *         schema: 
   *           type: Object
   *           properties: 
   *             status:
   *               type: string
   *           example: {
   *             "status": "Autorizado com sucesso!"
   *           }
   *       401:
   *         description: Unauthorized
   */
  app.get('/test', jsonWebToken.authenticate, async (req, res) => {
    res.status(HttpStatusCodes.OK).json({status: 'Autorizado com sucesso!'});
  });

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Show an User
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
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
   *             "password": "eysdaslkdjlaksj.asdasfsgfrsgdfsgdfg",
   *             "createdAt": "2018-01-02T20:14:22.527Z",
   *             "updatedAt": "2018-01-02T20:14:22.527Z"
   *           }
   *       404: 
   *         description: User not found
   */
  app.get('/:id', async (req, res) => {
    const id = req.params.id;
    let user = await userService.showAsync(id);
    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).send();
    }
    return res.json(user);
  });
};

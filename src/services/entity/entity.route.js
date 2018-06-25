const entityService = require('./entity.service');
const HttpStatusCodes = require('http-status-codes');

module.exports = (app, io) => {
  /**
   * @swagger
   * /entities:
   *   get:
   *     tags:
   *       - Entities
   *     summary: Returns a list of Entities
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         name: page
   *       - in: query
   *         name: pageSize
   *     responses:
   *       200:
   *         description: A JSON array of Entities 
   *         headers:
   *           X-Pagination-Total-Count:
   *             schema:
   *               type: integer
   *             description: Total rows in database
   *           X-Pagination-Per-Page:
   *             schema:
   *               type: integer
   *             description: Total rows in response array
   *           X-Pagination-Current-Page:
   *             schema:
   *               type: integer
   *             description: Current page of total rows
   *           X-Pagination-Page-Count:
   *             schema:
   *               type: integer
   *             description: Total pages for this context
   *         schema: 
   *           type: array
   *           items:
   *             properties: 
   *               id:
   *                 type: integer
   *               attr:
   *                 type: string
   *               createdAt:
   *                 type: date
   *               updatedAt:
   *                 type: date
   *           example: [
   *             {
   *               "id": 1,
   *               "attr": "Example Swagger Docs",
   *               "createdAt": "2018-05-30T17:22:22.527Z",
   *               "updatedAt": "2018-05-30T17:22:22.527Z"
   *             },
   *             {
   *               "id": 2,
   *               "attr": "Example Swagger Docs",
   *               "createdAt": "2018-05-30T17:22:22.527Z",
   *               "updatedAt": "2018-05-30T17:22:22.527Z"
   *             }
   *           ]
   *       404: 
   *         description: Entity not found
   */
  app.get('/', async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.pageSize || 10;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0) {
      limit = 1;
    }

    let options = {
      offset: page,
      limit: limit
    };

    options.offset = (options.offset - 1) * options.limit;

    entityService.indexAsync(options).then(list => {
      res.set('X-Pagination-Total-Count', list.count);
      res.set('X-Pagination-Per-Page', limit);
      res.set('X-Pagination-Current-Page', page);
      res.set('X-Pagination-Page-Count', Math.ceil(list.count/limit));

      res.json(list.rows || []);
    });
  });

  /**
   * @swagger
   * /entities/{id}:
   *   get:
   *     tags:
   *       - Entities
   *     summary: Show a entity
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
   *             attr:
   *               type: string
   *             createdAt:
   *               type: date
   *             updatedAt:
   *               type: date
   *           example: {
   *             "id": 1,
   *             "attr": "Example Swagger Docs",
   *             "createdAt": "2018-05-30T17:22:22.527Z",
   *             "updatedAt": "2018-05-30T17:22:22.527Z"
   *           }
   *       404: 
   *         description: Entity not found
   */
  app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const entity = await entityService.showAsync(id);
    if (!entity) {
      return res.status(HttpStatusCodes.NOT_FOUND).send();
    }
    return res.json(entity);
  });

  /**
   * @swagger
   * /entities:
   *   post:
   *     tags:
   *       - Entities
   *     summary: Creates a Entity
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - attr
   *           properties:
   *             attr:
   *               type: string
   *           example: {
   *             "attr": "Example Swagger Docs"
   *           }
   *     responses:
   *       200:
   *         description: OK
   *         schema: 
   *           type: Object
   *           properties: 
   *             id:
   *               type: integer
   *             attr:
   *               type: string
   *             createdAt:
   *               type: date
   *             updatedAt:
   *               type: date
   *           example: {
   *             "id": 1,
   *             "attr": "Example Swagger Docs",
   *             "createdAt": "2018-05-30T17:22:22.527Z",
   *             "updatedAt": "2018-05-30T17:22:22.527Z"
   *           }
   *       default:
   *         description: Error creating entity
   */
  app.post('/', async (req, res) => {
    try {
      const attr = req.body.attr;

      const entity = {
        attr
      };

      const newEntity = await entityService.createAsync(entity);

      entityService.showAsync(newEntity.id).then((entity) => {
        io.to('global').emit('entity', entity);
      });

      return res.json(newEntity);
    } catch (err) {
      return res.status(HttpStatusCodes.NOT_ACCEPTABLE).json((err && err.message) || global.__('entity_post_error'));
    }
  });

  /**
   * @swagger
   * /entities/{id}:
   *   put:
   *     tags:
   *       - Entities
   *     summary: Updates a Entity
   *     consumes:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - attr
   *           properties:
   *             attr:
   *               type: string
   *           example: {
   *             "attr": "Example Swagger Docs"
   *           }
   *     responses:
   *       204:
   *         description: NO CONTENT
   *       404:
   *         description: Entity not found
   *       default:
   *         description: Error updating Entity
   */
  app.put('/:id', async (req, res) => {
    try {
      const attr = req.body.attr;
      const entity = {
        attr
      };
      const updatedEntity = await entityService.updateAsync(req.params.id, entity);
      if (!updatedEntity) {
        return res.status(HttpStatusCodes.NOT_FOUND).json(global.__('entity_not_found'));
      }
      return res.status(HttpStatusCodes.NO_CONTENT).send();
    } catch (err) {
      return res.status(HttpStatusCodes.NOT_ACCEPTABLE).json((err && err.message) || global.__('entity_put_error'));
    }
  });

  /**
   * @swagger
   * /entities/{id}:
   *   delete:
   *     tags:
   *       - Entities
   *     summary: Delete a entity
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: Entity not found
   */
  app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await entityService.destroyAsync(id);
    if (!result) {
      return res.status(HttpStatusCodes.NOT_FOUND).send();
    }
    return res.status(HttpStatusCodes.OK).send();
  });
};

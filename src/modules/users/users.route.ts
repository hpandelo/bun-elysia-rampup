import Elysia from 'elysia'
import { UsersController } from './users.controller'
import { httpBodySchema, httpParamsSchema } from './users.types'

const controller = UsersController.getInstance();

export const usersRoutes = new Elysia({ prefix: '/users' })
  .onAfterHandle(({ responseValue, set }) => {
    // set.headers['Content-Type'] = 'application/json'
    set.headers['Farofa'] = 'application/bacon'

  })
  .get('/', controller.getAll.bind(controller), { detail: { summary: 'Get all users' } })
  .get('/:id', controller.getById.bind(controller), { params: httpParamsSchema, detail: { summary: 'Get a user by ID' } })
  .post('/', controller.create.bind(controller), { body: httpBodySchema, detail: { summary: 'Create a new user' } })
  .put('/:id', controller.update.bind(controller), { params: httpParamsSchema, body: httpBodySchema, detail: { summary: 'Update a user' } })
  .delete('/:id', controller.delete.bind(controller), { params: httpParamsSchema, detail: { summary: 'Delete a user' } })
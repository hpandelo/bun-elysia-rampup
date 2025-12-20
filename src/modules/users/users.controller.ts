import { Context } from 'elysia'
import { UsersHttpBody, UsersHttpParams } from './users.types'
import { UsersRepository } from './users.repository'

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;

export class UsersController {
  constructor(private repo: UsersRepository) {}

  // Factory built-in on class
  static getInstance(): UsersController {
    const repo = new UsersRepository();
    return new UsersController(repo);
  }

  getAll = async (c: Context) => {
    const result = await this.repo.getAll();

    c.set.headers = { 'x-total-count': result.length.toString() };
    return result;
  }

  getById = async (c: Context<UsersHttpParams>) => {
    const { id } = c.params;

    // if (!id) {
    //   return c.status(HTTP_BAD_REQUEST, { message: 'Bad Request' });
    // }

    const result = await this.repo.getOne(id);
    return c.status(result ? HTTP_OK : HTTP_NOT_FOUND, result);
  }

  create = async (c: Context<UsersHttpBody>) => {
    const { name } = c.body;

    // if (!name) {
    //   return c.status(HTTP_BAD_REQUEST, { message: 'Bad Request' });
    // }

    const result = await this.repo.create({ name });
    return c.status(HTTP_CREATED, result);
  }

  update = async (c: Context<UsersHttpBody>) => {
    const { id } = c.params;
    const { name } = c.body;

    // if (!id || !name) {
    //   return c.status(HTTP_BAD_REQUEST, { message: 'Bad Request' });
    // }

    const result = await this.repo.getOne(id);
    if (!result) {
      return c.status(HTTP_NOT_FOUND, { message: 'Not Found' });
    }

    const updatedUser = await this.repo.update(id, { ...result, name });

    return c.status(HTTP_OK, updatedUser);
  }

  delete = async (c: Context<UsersHttpParams>) => {
    const { id } = c.params;

    // if (!id) {
    //   return c.status(HTTP_BAD_REQUEST, { message: 'Bad Request' });
    // }
  
    const item = await this.repo.getOne(id);
    if (!item) {
      return c.status(HTTP_NOT_FOUND, { message: 'Not Found' });
    }

    await this.repo.delete(id);
    return c.status(HTTP_OK, item);
  }
}

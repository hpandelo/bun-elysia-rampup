import { describe, expect, it } from 'bun:test'
import { UsersController } from './users.controller'
import { User } from './users.types'
import { UsersRepository } from './users.repository'

const usersMockDb: User[] = [];

const repo = new UsersRepository(usersMockDb);
const controller = new UsersController(repo);

describe('Users Controller', () => {
  describe('getAll', () => {
    it('should return all users', async () => {
      const context = {
        status: () => context,
        set: {
          headers: {}
        }
      };

      const result = await controller.getAll(context as any);

      expect(result).toStrictEqual([]);
    })
  })
})

import { v7 } from 'uuid'
import { BaseRepository } from '../base'
import { CreateUser, User } from './users.types'

export class UsersRepository extends BaseRepository<User> {
    async create(data: CreateUser): Promise<User> {
      const newUser: User = {
        id: v7(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,

        ...data,
      }

      this.items.push(newUser)

      return Promise.resolve(newUser);
    }
} 
import { BaseItem } from './base.type'

export abstract class BaseRepository<T extends BaseItem> {
    constructor(protected readonly items: T[] = []) { }

    abstract create(data: T): Promise<T>;

    async getAll(): Promise<T[]> {
        return Promise.resolve(this.items);
    }

    async getOne(id: string): Promise<T | null> {
        const item = this.items.find(item => item.id === id);
        return Promise.resolve(item || null);
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            return Promise.reject(null);
        }

        const updated = { ...item, ...data, id };
        this.items[this.items.indexOf(item)] = updated;
        return Promise.resolve(updated);
    }

    async delete(id: string): Promise<T> {
        const deleted = { deletedAt: new Date().toISOString() } as unknown as Partial<T>;
        return await this.update(id, deleted);
    }

    async hardDelete(id: string): Promise<boolean> {
        const index = this.items.findIndex(user => user.id === id);
        if (index === -1) {
            return Promise.reject(false);
        }

        this.items.splice(index, 1);

        return Promise.resolve(true);
    }
}
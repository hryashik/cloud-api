export interface Repository<T> {
   find({}): Promise<T[] | null>;
   create(): Promise<T>;
}

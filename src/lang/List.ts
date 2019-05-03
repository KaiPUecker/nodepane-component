export class List<T>
    implements Iterable<T> {

    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    get last(): T {
        return this.items[this.items.length - 1];
    }

    get first(): T {
        return this.items[0];
    }

    getEntries(): Array<T> {
        return this.items;
    }

    size(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    indexOf(value: T): number {
        return this.items.indexOf(value);
    }

    insertAt(value: T, index: number): void {
        if (index >= 0 && index <= this.items.length) {
            this.items = this.items.splice(index, 0, value);
        }
    }

    remove(value: T): void {
        let index: number = this.indexOf(value);
        if (index != -1) {
            this.removeAt(index);
        }
    }

    removeAt(index: number): void {
        if (index >= 0 && index < this.items.length) {
            this.items = this.items.splice(index, 1);
        }
    }

    get(index: number): T {
        return this.items[index];
    }

    [Symbol.iterator](): Iterator<T> {
        let pointer = 0;
        let items = this.items;

        const iterator = {
            next(): IteratorResult<T> {
                if (pointer < items.length) {
                    return { value: items[pointer++] as T, done: false };
                } else {
                    return { value: undefined, done: true } as any as IteratorResult<T>;
                }
            }
        }

        return iterator;
    }

}

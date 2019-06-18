'use strict';


function nowTime(): number {
    return Date.now() / 1000;
}


interface IEntry {
    key?: string;
    value?: any;
    time?: number;

    prev?: IEntry;
    next?: IEntry;
}


class Deque {

    private head: IEntry;
    private tail: IEntry;

    constructor() {
        let head = { next: null },
            tail = { prev: null };
        head.next = tail;
        tail.prev = head;

        this.head = head;
        this.tail = tail;
    }

    push(entry: IEntry): void {
        entry.prev = this.head;
        entry.next = this.head.next;

        this.head.next.prev = entry;
        this.head.next = entry;
    }

    remove(entry: IEntry): void {
        let { prev, next } = entry;
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev;
        }
        delete entry.prev;
        delete entry.next;
    }

    use(entry: IEntry): void {
        this.remove(entry);

        entry.time = nowTime();
        this.push(entry);
    }

    getTail(): IEntry {
        let entry = this.tail.prev;
        if (entry === this.head) {
            return null;
        }
        return entry;
    }
}


export class LRUCache {

    private store: { [key: string]: IEntry };
    private deque: Deque;
    private timeout: number;

    constructor(timeout: number) {
        this.timeout = timeout;
        this.store = {};
        this.deque = new Deque();
    }

    makeEntry(key: string, value: any): IEntry {
        return { key, value, time: nowTime() };
    }

    get(key: string): any {
        this.sweep();
        let entry = this.store[key];
        if (!entry) return null;

        this.deque.use(entry);
        return entry.value;
    }

    set(key: string, value: any): void {
        this.sweep();
        let entry = this.store[key];
        if (entry) {
            entry.value = value;
            this.deque.use(entry);
        } else {
            entry = this.makeEntry(key, value);
            this.store[key] = entry;
            this.deque.push(entry);
        }
    }

    sweep(): void {
        while (true) {
            let entry = this.deque.getTail();

            if (!entry) return;
            if (nowTime() - entry.time < this.timeout) return;

            this.deque.remove(entry);
            delete this.store[entry.key];
        }
    }

    setTimeout(timeout: number): void {
        this.timeout = timeout;
    }
}


// timeout 12h
export const cache12 = new LRUCache(12 * 60 * 60);
// timeout 30m
export const cache30 = new LRUCache(30 * 60);

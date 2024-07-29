// LRUCache.ts

class Node {
    key: any;
    value: any;
    prev: Node | null;
    next: Node | null;

    constructor(key: any, value: any) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    private capacity: number;
    private cache: Map<any, Node>;
    private head: Node;
    private tail: Node;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new Node(null, null); // dummy head
        this.tail = new Node(null, null); // dummy tail
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    private _remove(node: Node) {
        let prev = node.prev!;
        let next = node.next!;
        prev.next = next;
        next.prev = prev;
    }

    private _add(node: Node) {
        let next = this.head.next!;
        this.head.next = node;
        node.prev = this.head;
        node.next = next;
        next.prev = node;
    }

    get(key: any): any | null {
        if (!this.cache.has(key)) return null;
        let node = this.cache.get(key)!;
        this._remove(node);
        this._add(node);
        return node.value;
    }

    put(key: any, value: any): void {
        if (this.cache.has(key)) {
            this._remove(this.cache.get(key)!);
        }
        let newNode = new Node(key, value);
        this._add(newNode);
        this.cache.set(key, newNode);

        if (this.cache.size > this.capacity) {
            let lru = this.tail.prev!;
            this._remove(lru);
            this.cache.delete(lru.key);
        }
    }

    getMostRecent(): any[] {
        let result: any[] = [];
        let current = this.head.next;
        while (current !== this.tail && current !== null && result.length < 3) {
            result.push(current?.value);
            current = current.next;
        }
        return result;
    }
}

export default LRUCache;

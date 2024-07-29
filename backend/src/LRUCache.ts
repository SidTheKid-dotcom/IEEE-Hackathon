class LRUCache {
    private capacity: number;
    private list: number[]; // List to maintain order
    private map: Map<number, any>; // Map to store the actual data

    constructor(capacity: number) {
        this.capacity = capacity;
        this.list = [];
        this.map = new Map();
    }

    get(key: number): any | undefined {
        if (!this.map.has(key)) {
            return undefined;
        }
        // Move the accessed item to the end of the list (most recent)
        const value = this.map.get(key);
        this.list = this.list.filter(item => item !== key);
        this.list.push(key);
        return value;
    }

    put(key: number, value: any): void {
        if (this.map.has(key)) {
            // Update existing value and move to the end of the list
            this.list = this.list.filter(item => item !== key);
        } else if (this.list.length >= this.capacity) {
            // Remove the oldest item (first in the list)
            const oldestKey = this.list.shift()!;
            this.map.delete(oldestKey);
        }
        this.list.push(key);
        this.map.set(key, value);
    }

    getAll(): any[] {
        // Convert the list to the cache values in the required order
        return this.list.map(key => this.map.get(key));
    }
}

const userCaches: Map<number, LRUCache> = new Map();

const getUserCache = (userId: number): LRUCache => {
    if (!userCaches.has(userId)) {
        userCaches.set(userId, new LRUCache(3)); // Assuming a capacity of 3
    }
    return userCaches.get(userId)!;
};

export { LRUCache, getUserCache };

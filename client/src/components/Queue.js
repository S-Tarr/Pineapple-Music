class Queue {
    constructor (queue) {
        this.queue = queue;
    }
    toString() {
        return this.queue
    }
}

// Firestore data converter
const queueConverter = {
    toFirestore: (queue) => {
        return {
            queue: queue.queue,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Queue(data.queue);
    }
};
class Queue {
  queue = [];
  front = 0;
  rear = 0;

  constructor(queue) {
    this.queue = queue || [];
    this.front = 0;
    this.rear = this.queue.length;
  }

  enqueue(value) {
    this.queue[this.rear] = value;
    this.rear++;
  }

  dequeue() {
    const returnValue = this.queue[this.front];
    delete this.queue[this.front++];
    return returnValue;
  }

  size() {
    return this.rear - this.front;
  }
}

export default Queue;

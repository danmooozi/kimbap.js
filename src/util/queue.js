class Queue {
  queue = [];
  front = 0;
  rear = 0;

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

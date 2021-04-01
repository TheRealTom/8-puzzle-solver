const topOfHeap = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  peek() {
    return this._heap[topOfHeap];
  }
  _push(...values) {
    values.forEach(value => {
      if (this.size() == 0){
        this._heap.push(value);
      } else {
        let added = false;
        for(let pos = 0; pos < this.size(); pos++) {
          if (this._comparator.function(this._heap[pos], value)) {
            added = true;
            this._heap.splice(pos, 0, value);
            break;
          }
        }
        if (! added) {
          this._heap.push(value);
        }
      }
    });
    return this.size();
  }
  pop() {
    const poppedValue = this._heap.shift();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[topOfHeap] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator.function(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftDown() {
    let node = topOfHeap;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

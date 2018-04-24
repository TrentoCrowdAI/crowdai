const emitter = require('./emitter');

test('emitter module should be defined', () => {
  expect(emitter).toBeDefined();
});

test('emitter.on should be defined', () => {
  expect(emitter.on).toBeDefined();
});

test('emitter.emit should be defined', () => {
  expect(emitter.emit).toBeDefined();
});

test('emitter module should allow to register listeners and emit events', () => {
  let listenerCalled = false;
  emitter.on('TEST_A', () => (listenerCalled = true));
  emitter.emit('TEST_A');
  expect(listenerCalled).toBe(true);
});

test('emitter module should pass the arguments to the listener', () => {
  let count;
  let anotherCount;

  emitter.on('TEST_A', (countArg, anotherCountArg) => {
    count = countArg;
    anotherCount = anotherCountArg;
  });
  emitter.emit('TEST_A', 10, 20);

  expect(count).toBe(10);
  expect(anotherCount).toBe(20);
});

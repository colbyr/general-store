export default {
  dependencies: jest.genMockFn().mockReturnValue({}),
  handlers: jest.genMockFn().mockReturnValue([]),
  queue: jest.genMockFn().mockReturnValue({}),
  stores: jest.genMockFn().mockReturnValue([]),
  storeFields: jest.genMockFn().mockReturnValue({}),
};

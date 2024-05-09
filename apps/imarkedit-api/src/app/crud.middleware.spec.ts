import { CrudMiddleware } from './crud.middleware';

describe('CrudMiddleware', () => {
  it('should be defined', () => {
    expect(new CrudMiddleware()).toBeDefined();
  });
});

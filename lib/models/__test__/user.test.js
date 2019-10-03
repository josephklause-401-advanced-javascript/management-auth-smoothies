const User = require('../users');

describe('User Model', () => {

  it('valid user model', () => {
    const data = {
      email: 'user@user.com',
      password: 'abc123',
      roles: []
    };

    const user = new User(data);
    expect(user.email).toBe(data.email);
    expect(user.password).toBeUndefined(user.password);
    user.generateHash(data.password);
    expect(user.hash).toBeDefined();
    expect(user.hash).not.toBe(data.password);
    expect(user.comparePassword(data.password)).toBe(true);
    expect(user.comparePassword('bad password')).toBe(false);
  });

  it('requires email and hash', () =>{
    const data = {};
    const user = new User(data);
    const { errors } = user.validateSync();
    expect(errors.email.kind).toBe('required');
    expect(errors.hash.kind).toBe('required');
  });

});
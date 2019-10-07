const Juice = require('../juice');

describe('juice model', () => {

  it('valid juice model', () => {
    const data = {
      name: 'Orange Sunshine',
      ingredients: ['orange', 'coconut', 'lime'],
    };

    const juice = new Juice(data);
    expect(juice.name).toEqual(data.name);
    expect(juice.ingredients[0]).toEqual(data.ingredients[0]);
  });

  it('invalid juice model', () => {
    const data = {};

    const juice = new Juice(data);
    const { errors } = juice.validateSync();
    expect(errors.name.kind).toBe('required');
    expect(errors.ingredients).toBe(undefined);
  });

});
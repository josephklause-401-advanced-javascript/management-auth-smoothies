const Smoothie = require('../smoothie');
const { ObjectId } = require('mongoose').Types;

describe('smoothie model', () => {

  it('valid smoothie model', () => {
    const data = {
      name: 'Kiwi Paradise',
      ingredients: ['kiwis', 'coconut', 'orange'],
      owner: new ObjectId
    };

    const smoothie = new Smoothie(data);
    expect(smoothie.name).toEqual(data.name);
    expect(smoothie.ingredients[0]).toEqual(data.ingredients[0]);
    expect(smoothie.owner).toBeDefined();
  });

  it('invalid smoothie model', () => {
    const data = {};

    const smoothie = new Smoothie(data);
    const { errors } = smoothie.validateSync();
    expect(errors.name.kind).toBe('required');
    expect(errors.ingredients).toBe(undefined);
  });

});
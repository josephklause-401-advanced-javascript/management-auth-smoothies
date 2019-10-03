const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');
// const User = require('../user');

describe('me api', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('smoothies'));

  let user = null;

  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const smoothie = {
    name: 'Kiwi Paradise',
    ingredients: ['kiwis', 'coconut', 'orange']
  };

  function postSmoothie(smoothie) {
    return request
      .post('/api/smoothies')
      .set('Authorization', user.token)
      .send(smoothie)
      .expect(200)
      .then(({ body }) => body);
  }

  function putFavSmoothie(smoothie) {
    return postSmoothie(smoothie).then(smoothie => {
      return request
        .put(`/api/me/favorites/${smoothie._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => body);
    });
  }

  it('puts a smoothie onto favorites of user', () => {
    return postSmoothie(smoothie).then(smoothie => {
      return request
        .put(`/api/me/favorites/${smoothie._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "ingredients": Array [
                "kiwis",
                "coconut",
                "orange",
              ],
              "name": "Kiwi Paradise",
            }
          `
          );
        });
    });
  });

  it('gets users favorites', () => {
    return Promise.all([
      putFavSmoothie(smoothie),
      putFavSmoothie(smoothie),
      putFavSmoothie(smoothie)
    ]).then(() => {
      return request
        .get('/api/me/favorites')
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "name": "Kiwi Paradise",
            }
          `
          );
        });
    });
  });

  it('deletes a user favorite', () => {
    return putFavSmoothie(smoothie)
      .then((favorites) => {
        return request
          .delete(`/api/me/favorites/${favorites[0]._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});

const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');

describe('Smoothies api', () => {
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

  it('posts a smoothie for this user', () => {
    return request
      .post('/api/smoothies')
      .set('Authorization', user.token)
      .send(smoothie)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "ingredients": Array [
              "kiwis",
              "coconut",
              "orange",
            ],
            "name": "Kiwi Paradise",
            "owner": Any<String>,
          }
        `
        );
      });
  });

  it('gets a list of smoothies all users can see all smoothies', () => {
    return Promise.all([
      postSmoothie(smoothie),
      postSmoothie(smoothie),
      postSmoothie(smoothie)
    ])
      .then(() => {
        return request
          .get('/api/smoothies')
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
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

  it('allows user to update their own smoothie', () => {
    return postSmoothie(smoothie).then(smoothie => {
      return request
        .put(`/api/smoothies/${smoothie._id}`)
        .set('Authorization', user.token)
        .send({
          name: 'Coco-Or-Ki',
          ingredients: ['kiwis', 'coconut', 'orange']
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
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
              "name": "Coco-Or-Ki",
            }
          `
          );
        });
    });
  });

  it('allows user to delete their smoothie', () => {
    return postSmoothie(smoothie)
      .then(smoothie => {
        return request
          .delete(`/api/smoothies/${smoothie._id}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(() => {
            return request
              .get('/api/smoothies')
              .set('Authorization', user.token)
              .expect(200);
          })
          .then(({ body }) => {
            expect(body.length).toBe(0);
          });
      });
  });
});

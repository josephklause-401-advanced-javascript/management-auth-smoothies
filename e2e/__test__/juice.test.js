const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');
const User = require('../../lib/models/user');

describe('Juice api', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('juices'));

  const testAdmin = {
    email: 'admin@admin.com',
    password: 'abc',
    roles: ['admin']
  };

  let testAdminToken;
  let testUserToken;

  beforeEach(() => {
    return signupUser(testAdmin).then(user => {
      testAdminToken = user.token;
    });
  });

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  beforeEach(() => {
    return signupUser(testUser).then(user => {
      testUserToken = user.token;
    });
  });

  const juice = {
    name: 'Orange Sunshine',
    ingredients: ['orange', 'coconut', 'lime']
  };

  function postJuice(juice) {
    return request
      .post('/api/juices')
      .set('Authorization', testAdminToken)
      .send(juice)
      .expect(200)
      .then(({ body }) => body);
  }

  it('it only allows posting of juice by admin', () => {
    return request
      .post('/api/juices')
      .set('Authorization', testAdminToken)
      .send(juice)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "ingredients": Array [
              "orange",
              "coconut",
              "lime",
            ],
            "name": "Orange Sunshine",
          }
        `
        );
      });
  });

  it('rejects postings by a non admin', () => {
    return request
      .post('/api/juices')
      .send(juice)
      .expect(401);
  });

  it('only allows puts by admins', () => {
    return postJuice(juice).then(juice => {
      return request
        .put(`/api/juices/${juice._id}`)
        .set('Authorization', testAdminToken)
        .send({
          name: 'black death'
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
                "orange",
                "coconut",
                "lime",
              ],
              "name": "black death",
            }
          `
          );
        });
    });
  });

  it('rejects puts by non admins', () => {
    return postJuice(juice).then(juice => {
      return request
        .put(`/api/juices/${juice._id}`)
        .send({
          name: 'black death'
        })
        .expect(401);
    });
  });

  it('only allows deletes by admins', () => {
    return postJuice(juice).then(juice => {
      return request
        .delete(`/api/juices/${juice._id}`)
        .set('Authorization', testAdminToken)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "ingredients": Array [
                "orange",
                "coconut",
                "lime",
              ],
              "name": "Orange Sunshine",
            }
          `
          );
        });
    });
  });

  it('rejects puts by non admins', () => {
    return postJuice(juice).then(juice => {
      return request
        .delete(`/api/juices/${juice._id}`)
        .expect(401);
    });
  });


  it('lets all users get', () => {
    return Promise.all([
      postJuice(juice),
      postJuice(juice)
    ])
      .then(() => {
        return request
          .get('/api/juices')
          .set('Authorization', testUserToken)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toMatchInlineSnapshot();
      });
  });
});

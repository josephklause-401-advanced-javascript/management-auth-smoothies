const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');
const User = require('../../lib/models/user');

describe('Auth-User API', () => {
  beforeEach(() => dropCollection('users'));

  const testAdmin = {
    email: 'admin@admin.com',
    password: 'abc',
    roles: ['admin']
  };

  let testAdminToken;
  let testUserId;

  beforeEach(() => {
    return signupUser(testAdmin).then(user => {
      testAdminToken = user.token;
      return User.updateById(user._id, {
        $addToSet: {
          roles: 'admin'
        }
      });
    });
  });

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  beforeEach(() => {
    return signupUser(testUser).then(user => {
      testUserId = user._id;
    });
  });

  it('puts a role into user', () => {
    return request
      .put(`/api/auth/users/${testUserId}/roles/bottom-dweller`)
      .set('Authorization', testAdminToken)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            hash: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "email": "me@me.com",
            "favorites": Array [],
            "hash": Any<String>,
            "roles": Array [
              "bottom-dweller",
            ],
          }
        `
        );
      });
  });

  it('deletes a user role', () => {
    return request
      .put(`/api/auth/users/${testUserId}/roles/bottom-dweller`)
      .set('Authorization', testAdminToken)
      .expect(200)
      .then(() => {
        return request
          .delete(`/api/auth/users/${testUserId}/roles/bottom-dweller`)
          .set('Authorization', testAdminToken)
          .expect(200)
          .then(({ body }) => {
            expect(body).toMatchInlineSnapshot(
              {
                _id: expect.any(String),
                hash: expect.any(String)
              },
              `
              Object {
                "__v": 0,
                "_id": Any<String>,
                "email": "me@me.com",
                "favorites": Array [],
                "hash": Any<String>,
                "roles": Array [],
              }
            `
            );
          });
      });
  });
});

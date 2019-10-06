const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');


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

  it('gets all users and returns email and roles', () => {
    return request
      .get('/api/auth/users')
      .set('Authorization', testAdminToken)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String)
          },
          `
          Object {
            "_id": Any<String>,
            "email": "admin@admin.com",
            "roles": Array [
              "admin",
            ],
          }
        `
        );
      });
  });
});

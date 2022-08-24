const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const postContentType = 'application/x-www-form-urlencoded'
const verifyUserToken = require('../middleware/verifyUserToken')
const testUserData = {
    signupData: {
        username: 'testName',
        email: 'testEmail@gmail.com',
        password: 'testPassword'
    },

    badEmailSignupData: {
        username: 'testName',
        email: 'notAnEmail',
        password: 'testPassword'
    },

    badPasswordSignupData: {
        username: 'testName',
        email: 'newBelal@gmail.com',
        password: 'test'
    }

}
let testUserResult = undefined;
let testUserToken = undefined;

describe('User auth tests', () => {

    it('bad email format error', async () => {
        const res = await request(app)
            .post('/users/signup')
            .set('content-type', postContentType)
            .send(testUserData.badEmailSignupData)
        expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
    })

    it('bad password format error', async () => {
        const res = await request(app)
            .post('/users/signup')
            .set('content-type', postContentType)
            .send(testUserData.badPasswordSignupData)
        expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
    })

    it('signup success', async () => {
        const res = await request(app)
            .post('/users/signup')
            .set('content-type', postContentType)
            .send(testUserData.signupData)
        testUserResult = res.body
        expect(res.status).to.equal(HTTP_STATUS_CODES.Created)
    })

    it('duplicate signup error', async () => {
        const res = await request(app)
            .post('/users/signup')
            .set('content-type', postContentType)
            .send(testUserData.signupData)
        expect(res.status).to.equal(HTTP_STATUS_CODES.ConflictError)
    })

    it('find by email success', async () => {
        const res = await request(app)
            .get(`/users/${testUserResult.email}`)
        expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
        expect(res.body.email).to.equal(testUserResult.email)
    })

    it('incorrect login credentials error', async () => {
        const res = await request(app)
            .post('/users/login')
            .set('content-type', postContentType)
            .send({
                email: 'notWorking@fake.com',
                password: 'notWorking'
            })
        expect(res.status).to.equal(HTTP_STATUS_CODES.NotAuthenticated)
    })

    it('login success', async () => {
        const res = await request(app)
            .post('/users/login')
            .set('content-type', postContentType)
            .send({
                email: testUserResult.email,
                password: 'testPassword'
            })
        expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
        testUserToken = res.body
    })

    it('verify token success', async () => {
        try {
            const tokenData = await verifyUserToken(testUserToken)
            expect(tokenData.user.email).to.equal(testUserResult.email)
        } catch (err) {
            expect(err).to.equal(undefined)
        }
    })

    it('failed token verification', async () => {
        try {
            await verifyUserToken(undefined)
        } catch (err) {
            expect(err.code).to.equal(HTTP_STATUS_CODES.NotAuthenticated)
        }
    })

    it('delete user', async () => {
        const res = await request(app)
            .delete(`/users/${testUserResult._id.toString()}`);
        expect(res.status).to.equal(HTTP_STATUS_CODES.Success);
    });

    after(async () => {
        module.exports.testUserToken = testUserToken;
    })
})
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const validate = require('../validation/validate')
const BaseTest = require('../lib/BaseTest')
const { signupSchema } = require('../validation/schemas/user')
const verifyUserToken = require('../middleware/verifyUserToken')
const { addUser, deleteUser, getUsers, getUserByEmail, login } = require('../services').userServices
let testUserResult = undefined;

class UsersServicesTest extends BaseTest {
    constructor(userTestData) {
        super(userTestData);
    }

    test = async () => {
        describe('User tervices tests', () => {

            it('bad email format error is detected', async () => {
                try {
                    const validationResult = await validate(signupSchema, this.testData.badEmailSignupData);
                    expect(validationResult.email).toEqual(null);
                } catch (err) {
                    expect(err.code).toEqual(HTTP_STATUS_CODES.UnprocessableEntity)
                    expect(err.details[0].message).toMatch(/(?:email)/)
                }
            })

            it('bad password format error is detected', async () => {
                try {
                    const validationResult = await validate(signupSchema, this.testData.badPasswordSignupData);
                    expect(validationResult.email).toEqual(null);
                } catch (err) {
                    expect(err.code).toEqual(HTTP_STATUS_CODES.UnprocessableEntity)
                    expect(err.details[0].message).toMatch(/(?:password)/)
                }
            })

            it('signup process is successful', async () => {
                try {
                    const res = await addUser(this.testData.validSignupData)
                    expect(res.email).toEqual(this.testData.validSignupData.email)
                    testUserResult = res;
                } catch (err) {
                    expect(err).toBeUndefined()
                }
            })

            it('duplicate signup error is detected', async () => {
                try {
                    const res = await addUser(this.testData.validSignupData)
                    expect(res).toBeUndefined()
                } catch (err) {
                    expect(err.code).toEqual(HTTP_STATUS_CODES.ConflictError)
                }
            })

            it('get users is successful', async () => {
                try {
                    const res = await getUsers()
                    expect(res).toBeDefined()
                } catch (err) {
                    expect(err).toBeUndefined()
                }
            })

            it('find by email is successful', async () => {
                try {
                    let email = this.testData.validSignupData.email
                    const res = await getUserByEmail(email)
                    expect(res.username).toEqual(this.testData.validSignupData.username)
                } catch (err) {
                    expect(err).toBeUndefined()
                }
            })

            it('incorrect login credentials error is detected', async () => {
                try {
                    const res = await login(this.testData.invalidLoginData)
                    expect(res).toBeUndefined()
                } catch (err) {
                    expect(err.code).toEqual(HTTP_STATUS_CODES.NotAuthenticated)
                }
            })

            it('login gives a verified token', async () => {
                try {
                    const loginData = {
                        email: testUserResult.email,
                        password: this.testData.validSignupData.password
                    }
                    const res = await login(loginData)
                    const check = await verifyUserToken(res)
                    expect(check.user.email).toEqual(loginData.email)
                } catch (err) {
                    expect(err).toBeUndefined()
                }
                
            })

            it('delete user is successful', async () => {
                const res = await deleteUser(testUserResult._id.toString())
                expect(res.email).toEqual(testUserResult.email);
            });
        })
    }
}

const testUserData = {
    /**
     * valid signup data
     * @type {Object}
     * @property {String} email - valid email
     * @property {String} password - valid password
     * @property {String} username - valid username
     */
    validSignupData: {
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
        password: 'it'
    },

    invalidLoginData: {
        email: 'notWorking@fake.com',
        password: 'notWorking'
    }
}
let testObject = new UsersServicesTest(testUserData)
testObject.test()
module.exports = testObject;
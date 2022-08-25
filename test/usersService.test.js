const { expect } = require('chai')
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const validate = require('../validation/validate')
const BaseTest = require('./BaseTest')
const { signupSchema, loginSchema } = require('../validation/schemas/user')
const verifyUserToken = require('../middleware/verifyUserToken')
const { addUser, deleteUser, getUsers, getUserByEmail, login } = require('../services/').userServices
let testUserResult = undefined;

class UsersServicesTest extends BaseTest {
    constructor(userTestData) {
        super(userTestData);
    }

    test = async () => {
        describe('User tervices tests', () => {

            it('bad email format error', async () => {
                try {
                    const validationResult = await validate(signupSchema, this.testData.badEmailSignupData);
                    expect(validationResult.email).to.equal(null);
                } catch (err) {
                    expect(err.code).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
                    expect(err.details[0].message).to.match(/(?:email)/)
                }
            })

            it('bad password format error', async () => {
                try {
                    const validationResult = await validate(signupSchema, this.testData.badPasswordSignupData);
                    expect(validationResult.email).to.equal(null);
                } catch (err) {
                    expect(err.code).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
                    expect(err.details[0].message).to.match(/(?:password)/)
                }
            })

            it('signup success', async () => {
                try {
                    const res = await addUser(this.testData.validSignupData)
                    expect(res.email).to.equal(this.testData.validSignupData.email)
                    testUserResult = res;
                } catch (err) {
                    expect(err).to.be.an('undefined')
                }
            })

            it('duplicate signup error', async () => {
                try {
                    const res = await addUser(this.testData.validSignupData)
                    expect(res).to.be.an('undefined')
                } catch (err) {
                    expect(err.code).to.equal(HTTP_STATUS_CODES.ConflictError)
                }
            })

            it('get users success', async () => {
                try {
                    const res = await getUsers()
                    expect(res).to.be.an('array')
                } catch (err) {
                    expect(err).to.be.an('undefined')
                }
            })

            it('find by email success', async () => {
                try {
                    let email = this.testData.validSignupData.email
                    const res = await getUserByEmail(email)
                    expect(res.username).to.equal(this.testData.validSignupData.username)
                } catch (err) {
                    expect(err).to.be.an('undefined')
                }
            })

            it('incorrect login credentials error', async () => {
                try {
                    const res = await login(this.testData.invalidLoginData)
                    expect(res).to.be.an('undefined')
                } catch (err) {
                    expect(err.code).to.equal(HTTP_STATUS_CODES.NotAuthenticated)
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
                    console.log(check)
                    expect(check.user.email).to.equal(loginData.email)
                } catch (err) {
                    expect(err).to.be.an('undefined')
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
                const res = await deleteUser(testUserResult._id.toString())
                expect(res.email).to.equal(testUserResult.email);
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

module.exports = new UsersServicesTest(testUserData)

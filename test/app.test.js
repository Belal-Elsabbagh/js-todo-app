const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const postContentType = 'application/x-www-form-urlencoded'
const { verifyUserToken } = require('../services').userServices
let testTodo = undefined;
let testUser = undefined;
let testUserToken = undefined;
chai.use(require("chai-http"));
chai.use(require('chai-as-promised'));
describe("App Tests", () => {

    describe('User auth tests', () => {

        it('duplicate signup error', async () => {
            const res = await chai
                .request(app)
                .post('/user/signup')
                .set('content-type', postContentType)
                .send({
                    username: 'testName',
                    email: 'belalAdel@gmail.com',
                    password: 'testPassword'
                })
            expect(res.status).to.equal(HTTP_STATUS_CODES.ConflictError)
        })

        it('bad email format error', async () => {
            const res = await chai
                .request(app)
                .post('/user/signup')
                .set('content-type', postContentType)
                .send({
                    username: 'testName',
                    email: 'notAnEmail',
                    password: 'testPassword'
                })
            expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
        })

        it('bad password format error', async () => {
            const res = await chai
                .request(app)
                .post('/user/signup')
                .set('content-type', postContentType)
                .send({
                    username: 'testName',
                    email: 'newBelal@gmail.com',
                    password: 'test'
                })
            expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
        })

        it('signup success', async () => {
            const res = await chai
                .request(app)
                .post('/user/signup')
                .set('content-type', postContentType)
                .send({
                    username: 'testName',
                    email: 'testEmail@gmail.com',
                    password: 'testPassword'
                })
            testUser = res.body
            expect(res.status).to.equal(HTTP_STATUS_CODES.Created)
        })

        it('find by email success', async () => {
            const res = await chai
                .request(app)
                .get(`/user/${testUser.email}`)
            expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
            expect(res.body.email).to.equal(testUser.email)
        })

        it('incorrect login credentials error', async () => {
            const res = await chai
                .request(app)
                .post('/user/login')
                .set('content-type', postContentType)
                .send({
                    email: 'notWorking@fake.com',
                    password: 'notWorking'
                })
            expect(res.status).to.equal(HTTP_STATUS_CODES.NotAuthenticated)
        })

        it('login success', async () => {
            const res = await chai
                .request(app)
                .post('/user/login')
                .set('content-type', postContentType)
                .send({
                    email: testUser.email,
                    password: 'testPassword'
                })
            expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
            testUserToken = res.body
        })

        it('verify token success', async () => {
            try {
                const tokenData = await verifyUserToken(testUserToken)
                expect(tokenData.user.email).to.equal(testUser.email)
            } catch (err) {
                expect(err).to.equal(undefined)
            }
        })
    })

    describe('Todo tests', () => {

        it("get todos", async () => {
            const res = await chai
                .request(app)
                .get("/todo")
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(200);
        });

        it("add todo", async () => {
            const res = await chai
                .request(app)
                .post("/todo")
                .set('content-type', postContentType)
                .set('authorization', `Bearer ${testUserToken}`)
                .send({
                    task: "unit test task."
                });
            testTodo = res.body;
            expect(res.status).to.equal(201);
        });

        it('get todo by id', async () => {
            const res = await chai
                .request(app)
                .get(`/todo/${testTodo._id.toString()}`)
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(200)
            expect(res.body.task).to.equal(testTodo.task)
        })

        it('update todo task', async () => {
            const updatedTask = "updated task"
            const res = await chai
                .request(app)
                .patch(`/todo/${testTodo._id.toString()}`)
                .set('content-type', postContentType)
                .set('authorization', `Bearer ${testUserToken}`)
                .send({
                    task: updatedTask
                });
            expect(res.status).to.equal(200)
            expect(res.body.task).to.equal(updatedTask)

        })

        it('complete todo', async () => {
            const res = await chai
                .request(app)
                .patch(`/todo/complete/${testTodo._id.toString()}`)
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(200);
            expect(res.body.isCompleted).to.equal(true);

        });

        it('reset todo', async () => {
            const res = await chai
                .request(app)
                .patch(`/todo/reset/${testTodo._id.toString()}`)
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(200);
            expect(res.body.isCompleted).to.equal(false);
            expect(res.body.timeCompleted).to.equal(null);

        });

        it('failed add todo verification error', async () => {
            const res = await chai
                .request(app)
                .post("/todo")
                .set('content-type', postContentType)
                .set('authorization', `Bearer ${testUserToken}`)
                .send({});
            expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
        })

        it('not found todo', async () => {
            let index = 1;
            const fakeId = testTodo._id.toString().substring(0, index) + '2' + testTodo._id.toString().substring(index + 1);

            const res = await chai.
                request(app)
                .get(`/todo/${fakeId}`)
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(HTTP_STATUS_CODES.NotFoundError)
        })
    });

    describe('cleanup tests', () => {

        it('delete todo', async () => {
            const res = await chai.
                request(app)
                .delete(`/todo/${testTodo._id.toString()}`)
                .set('authorization', `Bearer ${testUserToken}`)
            expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
        })

        it('delete user', async () => {
            const res = await chai
                .request(app)
                .delete(`/user/${testUser._id.toString()}`)
            expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
        })
    })
});
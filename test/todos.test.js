const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const postContentType = 'application/x-www-form-urlencoded'
let testTodo = undefined;
let testUserToken = undefined;
chai.use(require("chai-http"));
chai.use(require('chai-as-promised'));

describe('Todo tests', () => {
    before(async () => {
        const res = await chai
            .request(app)
            .post('/users/login')
            .set('content-type', postContentType)
            .send({
                email: 'belalAdel@gmail.com',
                password: '12345678'
            })
        testUserToken = res.body
    })

    it("get todos", async () => {
        const res = await chai
            .request(app)
            .get("/todos")
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(200);
    });

    it("add todo", async () => {
        const res = await chai
            .request(app)
            .post("/todos")
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
            .get(`/todos/${testTodo._id.toString()}`)
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(200)
        expect(res.body.task).to.equal(testTodo.task)
    })

    it('update todo task', async () => {
        const updatedTask = "updated task"
        const res = await chai
            .request(app)
            .patch(`/todos/${testTodo._id.toString()}`)
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
            .patch(`/todos/${testTodo._id.toString()}/complete`)
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(200);
        expect(res.body.isCompleted).to.equal(true);

    });

    it('reset todo', async () => {
        const res = await chai
            .request(app)
            .patch(`/todos/${testTodo._id.toString()}/reset`)
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(200);
        expect(res.body.isCompleted).to.equal(false);
        expect(res.body.timeCompleted).to.equal(null);

    });

    it('failed add todo verification error', async () => {
        const res = await chai
            .request(app)
            .post("/todos")
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
            .get(`/todos/${fakeId}`)
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(HTTP_STATUS_CODES.NotFoundError)
    })

    it('delete todo', async () => {
        const res = await chai.
            request(app)
            .delete(`/todos/${testTodo._id.toString()}`)
            .set('authorization', `Bearer ${testUserToken}`)
        expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
    })
});
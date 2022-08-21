const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const { HTTP_STATUS_CODES } = require('../middleware/errors')
const postContentType = 'application/x-www-form-urlencoded'

let testTodo = undefined;
chai.use(chaiHttp);
describe("App Tests", () => {

  describe('Todo tests', () => {

    it("get todos", async () => {
      const res = await chai.request(app).get("/todo")
      expect(res.status).to.equal(200);
    });

    it("add todo", async () => {
      const res = await chai
        .request(app)
        .post("/todo")
        .set('content-type', postContentType)
        .send({
          task: "unit test task."
        });
      testTodo = res.body;
      expect(res.status).to.equal(201);
    });

    it('get todo by id', async () => {
      const res = await chai.
        request(app)
        .get(`/todo/${testTodo._id.toString()}`)
      expect(res.status).to.equal(200)
      expect(res.body.task).to.equal(testTodo.task)
    })

    it('update todo task', async () => {
      const updatedTask = "updated task"
      const res = await chai
        .request(app)
        .patch(`/todo/${testTodo._id.toString()}`)
        .set('content-type', postContentType)
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
      expect(res.status).to.equal(200);
      expect(res.body.isCompleted).to.equal(true);

    });

    it('reset todo', async () => {
      const res = await chai
        .request(app)
        .patch(`/todo/reset/${testTodo._id.toString()}`)
      expect(res.status).to.equal(200);
      expect(res.body.isCompleted).to.equal(false);
      expect(res.body.timeCompleted).to.equal(null);

    });

    it('failed add todo error', async () => {
      const res = await chai
        .request(app)
        .post("/todo")
        .set('content-type', postContentType)
        .send({});
      expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
    })

    it('not found todo', async () => {
      let index = 1;
      const fakeId = testTodo._id.toString().substring(0, index) + '2' + testTodo._id.toString().substring(index + 1);

      const res = await chai.
        request(app)
        .get(`/todo/${fakeId}`)
      expect(res.status).to.equal(HTTP_STATUS_CODES.NotFoundError)
    })

    it('delete todo', async () => {
      const res = await chai.
        request(app)
        .delete(`/todo/${testTodo._id.toString()}`)
      expect(res.status).to.equal(HTTP_STATUS_CODES.Success)
    })
  });
});
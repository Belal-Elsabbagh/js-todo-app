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
      expect(res.status).to.equal(201);
      testTodo = res.body;
    });

    it('get todo by id', async () => {
      const res = await chai.
        request(app)
        .get(`/todo/${testTodo._id.toString()}`)
      expect(res.status).to.equal(200)
      expect(res.body.task).to.equal(testTodo.task)
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

    it('failed add todo error test', async () => {
      const res = await chai
        .request(app)
        .post("/todo")
        .set('content-type', postContentType)
        .send({});
      expect(res.status).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
    })

    it('not found todo test', async () => {
      const res = await chai.
        request(app)
        .get(`/todo/${'test'}`)
      expect(res.status).to.equal(HTTP_STATUS_CODES.NotFoundError)
    })

    it('finished', async () => {
      process.exit(0);
    });
  });
});
const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { idText, isTemplateLiteralToken } = require("typescript");
const { expect } = chai;
const postContentType = 'application/x-www-form-urlencoded'
let testTodo = {}
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
    })

    it('complete todo', async () => {
      const res = await chai
        .request(app)
        .patch(`/todo/complete/${testTodo._id}`)
      expect(res.status).to.equal(200);
      expect(res.body.isCompleted).to.equal(true);
    })

    it('reset todo', async () => {
      const res = await chai
        .request(app)
        .patch(`/todo/reset/${testTodo._id}`)
      expect(res.status).to.equal(200);
      expect(res.body.isCompleted).to.equal(false);
      expect(res.body.timeCompleted).to.equal(null);
    })
    
    it('finished', async () => {
      process.exit(0);
    });
  });
});
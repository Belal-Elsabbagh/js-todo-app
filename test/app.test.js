const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {
  it("get todos", (done) => {
    chai.request(app).get("/todo")
      .then((res) => {
        expect(res.status).to.equal(200);
      }).catch((err) => {
        throw err;
      }).finally(done => { done() });
  });
});

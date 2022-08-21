const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {
  it("get todos", (done) => {
    chai.request(app).get("/todo").end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});

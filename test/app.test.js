const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {
  it("get todos", async () => {
    const res = await chai.request(app).get("/todo")
    expect(res.status).to.equal(200);
  });
  it('finished', async () => {
    process.exit(0);
  })
});
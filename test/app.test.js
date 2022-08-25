

describe("App Tests", async () => {
    await require('./usersService.test').test()
    require('./todosService.test')
});
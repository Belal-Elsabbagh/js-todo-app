const { expect } = require("chai");
const { HTTP_STATUS_CODES } = require('../middleware/errors');
const { addTodo, getAllTodos, deleteTodo, getTodoById, updateTodo, completeTodo, resetTodo } = require("../services").todoServices;
let testTodo = undefined;

describe('Todo tests', () => {

    it("get todos", async () => {
        const res = await getAllTodos();
        expect(res).to.be.an('array');
    });

    it('failed add todo verification error', async () => {
        try {
            const res = await addTodo({})
        } catch (err) {
            expect(err.code).to.equal(HTTP_STATUS_CODES.UnprocessableEntity)
        }
    })

    it("add todo", async () => {
        const testTask = {
            task: "unit test task."
        }
        const res = await addTodo(testTask)
        testTodo = res;
        expect(res.task).to.equal(testTask.task);
    });

    it('get todo by id', async () => {
        const res = await getTodoById(testTodo._id.toString())
        expect(res.task).to.equal(testTodo.task)
    })

    it('not found todo', async () => {
        let index = 1;
        const fakeId = testTodo._id.toString().substring(0, index) + '2' + testTodo._id.toString().substring(index + 1);
        try {
            const res = await getTodoById(fakeId)
        } catch (err) {
            expect(err.code).to.equal(HTTP_STATUS_CODES.NotFoundError)
        }
    })

    it('update todo task', async () => {
        const updatedTask = "updated task"
        const res = await updateTodo(testTodo._id.toString(), {
            task: updatedTask
        })
        testTodo = res;
        expect(res.task).to.equal(updatedTask)
    })

    it('complete todo', async () => {
        const res = await completeTodo(testTodo._id.toString())
        expect(res.isCompleted).to.equal(true);
    });

    it('reset todo', async () => {
        const res = await resetTodo(testTodo._id.toString())
        expect(res.isCompleted).to.equal(false)
        expect(res.timeCompleted).to.equal(null);
    });

    it('delete todo', async () => {
        const res = await deleteTodo(testTodo._id.toString())
        expect(res.task).to.equal(testTodo.task);
    })
});
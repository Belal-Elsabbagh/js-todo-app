const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { HTTP_STATUS_CODES } = require('../middleware/errors');
const validate = require('../validation/validate')
const todoSchema = require('../validation/schemas/todo')
const { addTodo, getAllTodos, deleteTodo, getTodoById, updateTodo, completeTodo, resetTodo } = require("../services").todoServices;
let testTodo = undefined;

describe('Todo tests', () => {

    it("get todos", async () => {
        const res = await getAllTodos();
        expect(Array.isArray(res)).toBe(true);
    });

    it('failed add todo verification error', async () => {
        try {
            const res = await validate(todoSchema, {});
        } catch (err) {
            expect(err.code).toEqual(HTTP_STATUS_CODES.UnprocessableEntity)
            expect(err.details[0].message).toMatch(/(?:task)/)
        }
    })

    it("add todo", async () => {
        const testTask = {
            task: "unit test task."
        }
        const res = await addTodo(testTask)
        testTodo = res;
        expect(res.task).toEqual(testTask.task);
    });

    it('get todo by id', async () => {
        const res = await getTodoById(testTodo._id.toString())
        expect(res.task).toEqual(testTodo.task)
    })

    it('not found todo', async () => {
        let index = 1;
        const fakeId = testTodo._id.toString().substring(0, index) + '2' + testTodo._id.toString().substring(index + 1);
        try {
            const res = await getTodoById(fakeId)
        } catch (err) {
            expect(err.code).toEqual(HTTP_STATUS_CODES.NotFoundError)
        }
    })

    it('update todo task', async () => {
        const updatedTask = "updated task"
        const res = await updateTodo(testTodo._id.toString(), {
            task: updatedTask
        })
        testTodo = res;
        expect(res.task).toEqual(updatedTask)
    })

    it('complete todo', async () => {
        const res = await completeTodo(testTodo._id.toString())
        expect(res.isCompleted).toEqual(true);
    });

    it('reset todo', async () => {
        const res = await resetTodo(testTodo._id.toString())
        expect(res.isCompleted).toEqual(false)
        expect(res.timeCompleted).toEqual(null);
    });

    it('delete todo', async () => {
        const res = await deleteTodo(testTodo._id.toString())
        expect(res.task).toEqual(testTodo.task);
    })
});
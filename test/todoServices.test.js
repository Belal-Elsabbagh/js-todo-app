const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const { HTTP_STATUS_CODES } = require('../middleware/errors');
const validate = require('../validation/validate')
const todoSchema = require('../validation/schemas/todo')
const { addTodo, getAllTodos, deleteTodo, getTodoById, getTodos, updateTodo, completeTodo, resetTodo } = require("../services").todoServices;

describe('Todo tests', () => {

    it("get todos", async () => {
        const res = await getAllTodos();
        expect(Array.isArray(res)).toBe(true);
    });

    describe('get todo by isDone filter', () => {
        let res;
        beforeAll(async () => {
            res = await getTodos({ isCompleted: false });
        })

        it('should return an array', () => {
            expect(Array.isArray(res)).toBe(true);
        })

        it('all todos should be incomplete', () => {
            res.forEach(todo => {
                expect(todo.isCompleted).toBe(false);
            })
        })
    })

    it('failed add todo verification error', async () => {
        try {
            const res = await validate(todoSchema, {});
            expect(res).toBe(undefined);
        } catch (err) {
            expect(err.code).toEqual(HTTP_STATUS_CODES.ValidationError)
            expect(err.details[0].message).toMatch(/(?:task)/)
        }
    })

    describe("add todo", () => {
        let res;
        const testTask = { task: "unit test task." }
        beforeAll(async () => {
            res = await addTodo(testTask)
        })

        it('object has a defined task attribute', async () => {
            expect(res.task).toEqual(testTask.task);
        })

        it('object has a false isCompleted attribute', async () => {
            expect(res.isCompleted).toBe(false)
        })

        it('object has a null timeCompleted attribute', async () => {
            expect(res.timeCompleted).toBeNull()
        })

        afterAll(async () => {
            await deleteTodo(res._id.toString())
        })
    });

    describe('operations on todos', () => {
        let testTodo;
        const testTask = { task: "unit test task." }
        beforeAll(async () => {
            testTodo = await addTodo(testTask)
        })

        it('get todo by id', async () => {
            const res = await getTodoById(testTodo._id.toString())
            expect(res.task).toEqual(testTodo.task)
        })
    
        it('not found todo', async () => {
            let index = 1;
            const fakeId = testTodo._id.toString().substring(0, index) + '2' + testTodo._id.toString().substring(index + 1);
            try {
                const res = await getTodoById(fakeId)
                expect(res).toBe(undefined)
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
    
        afterAll(async () => {
            await deleteTodo(testTodo._id.toString())
        })
    })
});
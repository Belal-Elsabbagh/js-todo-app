const axios = require('axios');
const testId = '62f8e199cd12203206faca36'
const TEST_getAllTodos = async () => {
    let result = await axios.get('http://localhost:3000/user')
    if (result.status === 200) return result.data
    throw new 1
}

const TEST_getTodoById = async (id) => {
    let result = await axios.get(`http://localhost:3000/user/${id}`)
    if (result.status === 200) return result.data
    throw new 2
}

try{
    TEST_getAllTodos()
    TEST_getTodoById(testId)
    process.exit(0)
} catch (err) {
    process.exit(err)
}

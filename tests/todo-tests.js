const axios = require('axios');
const testId = '62f8e199cd12203206faca36'
const TEST = async (requestMethod, url, requestBody, successCode, errorCode) => {
    const testResults = axios({
        method: requestMethod,
        url: url,
        data: requestBody
    });
    if (testResults.status !== successCode) throw new errorCode
    return testResults.data
}

try {
    TEST('get', 'http://localhost:3000/user', {}, 200, 1)
    TEST('get', `http://localhost:3000/user/${testId}`, {}, 200, 2)
    console.log("Tests passed")
    process.exit(0)
} catch (err) {
    process.exit(err)
}

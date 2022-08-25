const AccessControl = require('accesscontrol')

let grantsObject = {
    admin: {
        todo: {
            'create:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        }
    },
    user: {
        todo: {
            'read:any': ['*'],
        }
    }
};
module.exports = new AccessControl(grantsObject);
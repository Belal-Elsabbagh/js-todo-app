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
export default new AccessControl(grantsObject);
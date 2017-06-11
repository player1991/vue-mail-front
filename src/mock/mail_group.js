import Mock from 'mockjs';

const list = [];
const count = 6;

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: '@ctitle',
        contacts: [
            {
                name: '@cname',
                mail: '@email'
            },
            {
                name: '@cname',
                mail: '@email'
            },
            {
                name: '@cname',
                mail: '@email'
            },
            {
                name: '@cname',
                mail: '@email'
            },
            {
                name: '@cname',
                mail: '@email'
            }
        ]
    }));
}

export default {
    getList: () => {
        return {
            total: list.length,
            groupList: list
        }
    }
};
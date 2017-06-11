import Mock from 'mockjs';
import { param2Obj } from 'utils';

const list = [];
const count = 100;

for (let i = 0; i < count; i++) {
    list.push(Mock.mock({
        id: '@increment',
        name: '@cname',
        mail: '@email'
    }));
}

export default {
    getList: config => {
        const { name, mail, groupId, page, limit } = param2Obj(config.url);
        let mockList = list.filter(item => {
            if (name && item.name !== name) return false;
            if (mail && item.mail !== mail) return false;
            if (groupId && item.groupId !== groupId) return false;
            return true;
        });
        if (page) {
            mockList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        }
        return {
            total: mockList.length,
            contacts: mockList
        }
    }
};
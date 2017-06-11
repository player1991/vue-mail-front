import Mock from 'mockjs';
import { param2Obj } from 'utils';

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        'isStar|1': true,
        'isHaveFile|1': true,
        'isHaveAudio|1': true,
        'type|1': ['receive', 'send', 'draft'],
        sendName: '@cname',
        sendMail: '@email',
        labelList: [
            {
                guid: '1',
                name: '标签1'
            },
            {
                guid: '2',
                name: '标签2'
            },
            {
                guid: '3',
                name: '标签3'
            }
        ],
        title: '@ctitle(10, 30)',
        date: +Mock.Random.date('T')
    }));
}

export default {
    getList: config => {
        debugger
        const { type, title, dateRange, page, limit } = param2Obj(config.url);
        let mockList = List.filter(item => {
            if (type && item.type !== type) return false;
            if (title && item.title.indexOf(title) < 0) return false;
            // if (dataRange[0] && item.dateRange[0]) return false;
            return true;
        });
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        return {
            total: mockList.length,
            items: pageList
        }
    }
};
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
        'status|1': [0, 1, 2, 3],
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
        receiveDate: +Mock.Random.date('T'),
        readDate: +Mock.Random.date('T')
    }));
}

export default {
    getList: config => {
        const { status, title, page, limit, sort } = param2Obj(config.url);
        let mockList = List.filter(item => {
            if (status && item.status !== +status) return false;
            if (title && item.title.indexOf(title) < 0) return false;
            return true;
        });
        if (sort === '+title') {
            const sortByTitleASC = function(a, b) {
                const aTitle = a.title,
                      bTitle = b.title;
                return aTitle - bTitle;
            }
            mockList = mockList.reverse(sortByTitleASC);
        }
        if (sort === '-title') {
            const sortByTitle = function(a, b) {
                const aTitle = a.title,
                      bTitle = b.title;
                return bTitle - aTitle;
            }
            mockList = mockList.reverse(sortByTitle);
        }
        if (sort === '+sender') {
            const sortByNameASC = function(a, b) {
                const aName = a.sendName,
                    bName = b.sendName;
                return aName - bName;
            }
            mockList = mockList.reverse(sortByNameASC);
        }
        if (sort === '-sender') {
            const sortByName = function(a, b) {
                const aName = a.sendName,
                    bName = b.sendName;
                return bName - aName;
            }
            mockList = mockList.reverse(sortByName);
        }
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
        return {
            total: mockList.length,
            items: pageList
        }
    }
};
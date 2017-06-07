import Mock from 'mockjs';


const List = [];
const count = 100;


for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        name: '@cname',
        mail: '@email'
    }));
}

export default {
    getList: () => List
};

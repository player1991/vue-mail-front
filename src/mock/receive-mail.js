import Mock from 'mockjs';


const List = [];
const count = 100;


for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@id',
        'isStar|1': true,
        'isRead|1': true,
        'isHaveFile|1': true,
        'isHaveAudio|1': true,
        sender: '@cname',
        title: '@ctitle(10, 20)',
        receiveDate: +Mock.Random.date('T'),
        readDate: +Mock.Random.date('T')
    }));
}

export default {
    getList: () => List,
    getReceiveMail: () => ({
        id: 120000000001,
        title: '编号为001的收件',
        content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        sender: '@cname',
        sendDate: +Mock.Random.date('T'),
        receiverList: [
            {
                name: '曾艳芬',
                mail: 'zengyanfen@snh48.com'
            },
             {
                name: '鞠婧祎',
                mail: 'jujingyi@snh48.com'
            },
             {
                name: '黄婷婷',
                mail: 'huangtingting@snh48.com'
            },
             {
                name: '李艺彤',
                mail: 'liyitong@snh48.com'
            },
             {
                name: '冯薪朵',
                mail: 'fengxinduo@snh48.com'
            }
        ],
        copyerList: [
            {
                name: '陆婷',
                mail: 'luting@snh48.com'
            },
             {
                name: '万丽娜',
                mail: 'wanlina@snh48.com'
            },
             {
                name: '易嘉爱',
                mail: 'yijiaai@snh48.com'
            },
             {
                name: '林思意',
                mail: 'linsiyi@snh48.com'
            },
             {
                name: '赵粤',
                mail: 'zhaoyue@snh48.com'
            }
        ],
        fileList: [
            {
                fileName: '第四届年度总选',
                fileUrl: ''
            },
            {
                fileName: '第四届年度总选',
                fileUrl: ''
            }
        ],
        audioList: [
            {
                fileName: '子杰的录音',
                fileUrl: ''
            },
            {
                fileName: '总选寄语',
                fileUrl: ''
            }
        ]
    })
};

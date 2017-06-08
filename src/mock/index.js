import Mock from 'mockjs';
import loginAPI from './login';
import articleAPI from './article';
import article_tableAPI from './article_table';
import remoteSearchAPI from './remoteSearch';
import inboxAPI from './inbox';
import contactsAPI from './contacts';
import mailDetailAPI from './mail_detail';

// 登录相关
Mock.mock(/\/login\/loginbyemail/, 'post', loginAPI.loginByEmail);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getInfo)

// // 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList);
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle);

// 邮件相关
Mock.mock(/\/inbox\/list/, 'get', inboxAPI.getList);
Mock.mock(/\/contacts\/list/, 'get', contactsAPI.getList);
Mock.mock(/\/mail_detail/, 'get', mailDetailAPI.getDetail);

// // table example相关
Mock.mock(/\/article_table\/list/, 'get', article_tableAPI.getList);
Mock.mock(/\/article_table\/p/, 'get', article_tableAPI.getPv);

// // 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser);


export default Mock;
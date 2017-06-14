import Mock from 'mockjs';
import loginAPI from './login';
import articleAPI from './article';
import article_tableAPI from './article_table';
import remoteSearchAPI from './remoteSearch';
import inboxAPI from './inbox';
import outboxAPI from './outbox';
import draftboxAPI from './draftbox';
import mailDetailAPI from './mail_detail';
import mailLabelAPI from './mail_label';
import mailListAPI from './mail_list';
import groupAPI from './mail_group';
import contactsAPI from './mail_contacts';

// 登录相关
Mock.mock(/\/login\/loginbyemail/, 'post', loginAPI.loginByEmail);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getInfo)

// // 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList);
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle);

// 邮件相关
Mock.mock(/\/inbox\/list/, 'get', inboxAPI.getList);
Mock.mock(/\/outbox\/list/, 'get', outboxAPI.getList);
Mock.mock(/\/draftbox\/list/, 'get', draftboxAPI.getList);
Mock.mock(/\/contacts\/list/, 'get', contactsAPI.getList);
Mock.mock(/\/mail_detail/, 'get', mailDetailAPI.getDetail);
Mock.mock(/\/mail_label\/list/, 'get', mailLabelAPI.getList);
Mock.mock(/\/mail_list/, 'get', mailListAPI.getList);
Mock.mock(/\/mail_group\/list/, 'get', groupAPI.getList);
Mock.mock(/\/mail_contacts\/list/, 'get', contactsAPI.getList);

// // table example相关
Mock.mock(/\/article_table\/list/, 'get', article_tableAPI.getList);
Mock.mock(/\/article_table\/p/, 'get', article_tableAPI.getPv);

// // 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser);


export default Mock;
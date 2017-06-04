import fetch from 'utils/fetch';

export function getList() {
    return fetch({
        url: '/receive-mail/list',
        method: 'get'
    });
}

export function getArticle() {
    return fetch({
        url: '/receive-mail/detail',
        method: 'get'
    });
}


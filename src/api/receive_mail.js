import fetch from 'utils/fetch';

export function fetchList(query) {
    return fetch({
        url: '/receive_mail/list',
        method: 'get',
        params: query
    });
}

export function fetchPv(pv) {
    return fetch({
        url: '/receive_mail/pv',
        method: 'get',
        params: { pv }
    });
}
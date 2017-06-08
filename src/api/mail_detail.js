import fetch from 'utils/fetch';

export function fetchDetail(query) {
    return fetch({
        url: 'mail_detail',
        method: 'get',
        params: query
    })
}
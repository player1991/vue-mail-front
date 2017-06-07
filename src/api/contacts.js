import fetch from 'utils/fetch';

export function fetchContacts() {
    return fetch({
        url: '/contacts/list',
        method: 'get'
    })
}
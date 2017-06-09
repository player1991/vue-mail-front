import fetch from 'utils/fetch';
import { Observable } from 'rxjs/Observable';

export function fetchList() {
    return fetch({
        url: '/mail_label/list',
        method: 'get'
    });
}

export function add(labelDTO) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 200);
    })
}

export function edit(labelDTO) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 200);
    })
}

export function del(id) {
    return Observable.create(observer => {
        setTimeout(observer.next(), 200);
    })
}
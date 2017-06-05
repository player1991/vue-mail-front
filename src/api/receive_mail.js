import fetch from 'utils/fetch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

export function fetchList(query) {
    return fetch({
        url: '/receive_mail/list',
        method: 'get',
        params: query
    });
}

export function fetchDetail(id) {
    return fetch({
        url: '/receive_mail/detail',
        method: 'get',
        params: id
    });
}

export function delReceiveMail(idArr) {
    const idStr = String(idArr);
    console.log('要删除的收件id:' + idStr);
    return Observable.create(observer => {
        setTimeout(() => { observer.next(true); }, 1000);
    });
}
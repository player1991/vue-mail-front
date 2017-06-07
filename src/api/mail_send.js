import { Observable } from 'rxjs/Observable';

export function sendMail(mailDTO) {
    return Observable.create(observer => {
        setTimeout(() => observer.next(), 2000);
    })
}
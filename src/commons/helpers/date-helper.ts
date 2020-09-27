import * as moment from 'moment';
enum duration {
    hour = 'hour',
    hours = 'hours',
    days = 'days',
    year = 'year',
    years = 'years',
    M = 'M',
    Q = 'Q',
    d = 'd',
    m = 'm'
};
export class DateHelper {
    public static current() {
        return moment().toDate();
    }

    public static now() {
        return moment();
    }

    public static expiresTime(time: number, type: duration  = duration.hours): number {
        return this.now().add(time,type).toDate().getTime()
    }
}
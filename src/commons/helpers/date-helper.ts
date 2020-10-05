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
    public static current(): Date {
        return moment().toDate();
    }

    public static now(): moment.Moment {
        return moment();
    }

    public static toDate(time: number): moment.Moment {
        return moment(time)
    }

    public static expiresTime(time: number, type: duration  = duration.hours): number {
        return this.now().add(time,type).toDate().getTime()
    }

    public static isExpired(time: number): boolean {
        const date = this.toDate(time);
        if (date.diff(new Date(), 'minutes') < 0) {
            return true;
        }
        return false;
    }
}
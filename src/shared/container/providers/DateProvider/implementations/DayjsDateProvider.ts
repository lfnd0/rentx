import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const start_date_UTC = this.convertToUTC(start_date);
    const end_date_UTC = this.convertToUTC(end_date);

    return dayjs(end_date_UTC).diff(start_date_UTC, "hours");
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
}

export { DayjsDateProvider };

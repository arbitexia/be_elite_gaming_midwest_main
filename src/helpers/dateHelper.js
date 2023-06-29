import { add, addMinutes, addDays, addHours, differenceInDays, format, sub } from 'date-fns';

export const addDateTime = (params) => add(new Date(), params);
export const formatDate = (str, sync) => format(new Date(str), sync);
export const afterXMinutes = (x) => addMinutes(new Date(), x);
export const afterXHours = (x) => addHours(new Date(), x);
export const afterXDays = (x) => addDays(new Date(), x);

export const subDateTime = (params) => sub(new Date(), params);

export const distanceInDays = (d1, d2) => differenceInDays(new Date(d1), new Date(d2));

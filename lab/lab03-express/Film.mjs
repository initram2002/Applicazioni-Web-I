/**
 * This file exports a constructor (in function form) to create "Film" objects.
 * Main features:
 * 
 * - The following are assigned: id, title, isFavorite, rating, watchDate, userId.
 * - If watchDate is defined, it is transformed into a dayjs object (library for handling dates).
 */

import dayjs from 'dayjs';

export default function Film(id, title, isFavorite, rating, watchDate, userId) {
    this.id = id;
    this.title = title;
    this.isFavorite = isFavorite;
    this.rating = rating;
    // Saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);
    this.userId = userId;
}
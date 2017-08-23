import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users', {}, {idAttribute: 'id'});

const waitingUser = new schema.Entity('waitingUsers', {}, {idAttribute: 'id'});

const restaurant = new schema.Entity('restaurants', {}, { idAttribute: 'id' });

const waitingList = new schema.Entity('waitingLists', {}, { idAttribute: 'id' });

const favourite = new schema.Entity('favourites', {}, { idAttribute: 'id' });

const restaurantData = new schema.Entity('restaurantDatas', {}, { idAttribute: 'slug' });

const restaurantTable = new schema.Entity('restaurantTables', {}, { idAttribute: 'id' });

const bookingTable = new schema.Entity('bookingTables', {}, { idAttribute: 'id' });

export default {
    user,
    restaurant,
    waitingList,
    favourite,
    restaurantData,
    restaurantTable,
    bookingTable,
    waitingUser,

    normalize,
    schema
} 
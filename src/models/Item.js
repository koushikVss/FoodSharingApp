const Datastore = require('nedb');
const db = new Datastore({ filename: './src/models/items.db', autoload: true });
const moment = require('moment');

class Item {

    constructor(name, description, expirationDate, ownerId) {
        this.name = name;
        this.description = description;
        this.expirationDate = expirationDate;
        this.userId = ownerId;
    }
    static create(item, callback) {
        db.insert(item, callback);
    }

    static findAllAvailable(callback) {
        const currentDate = moment().toDate();
        db.find({ status: 'available', expirationDate: { $gt: moment().startOf('day').format('YYYY-MM-DD') } }, callback);
    }

    static findById(id, callback) {
        db.findOne({ _id: id }, callback);
    }

    static selectItem(id, callback) {
        db.update({ _id: id }, { $set: { status: 'selected' } }, {}, callback);
    }

    static async getItemsByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.find({ userId: userId }, (err, items) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("items fonund ",items)
                    resolve(items);
                }
            });
        });
    }
    static delete(id, callback) {
        db.remove({ _id: id }, {}, callback);
    }
}

module.exports = Item;

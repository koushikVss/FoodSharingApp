const Datastore = require('nedb');
const db = new Datastore({ filename: './src/models/users.db', autoload: true });
db.persistence.setAutocompactionInterval(10 * 1000)
class User {

    constructor(username, email, password, role = 'user') {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    static create(user, callback) {
        db.insert(user, callback);
    }

    static findByUsername(username, callback) {
        db.findOne({ username }, callback);
    }

    static findById(id, callback) {
        db.findOne({ _id: id }, callback);
    }

    static findAll(callback) {
        db.find({}, callback);
    }

    static delete(id, callback) {
        db.remove({ _id: id }, {}, callback);
    }
}

module.exports = User;

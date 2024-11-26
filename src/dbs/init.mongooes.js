const mongoose = require("mongoose");
const { db_host, db_name, db_port } = require("../config")
const connectString = `mongodb://${db_host}:${db_port}/${db_name}`;
class Database {
    constructor() {
        this.connect();
    }
    connect() {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        console.log("connectString", connectString);
        
        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then(() =>
                console.log("Connected Success!!! " + connectString)
            )
            .catch(() => console.log("Connect database error"));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
const config = {
    port: process.env.PORT || 3000,
    db_host: process.env.DEV_DB_HOST || "127.0.0.1",
    db_port: process.env.DEV_DB_PORT || "27017",
    db_name: process.env.DEV_DB_NAME || "english",

}

module.exports = config
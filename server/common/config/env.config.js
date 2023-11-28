module.exports = {
    "port": 3001,
    "address": "localhost",
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    },
    "database": {
        "host": "mongodb+srv://pearlee:blackberry123@motodb.mrqbd.mongodb.net/bandbook?retryWrites=true&w=majority",
        "collection": "listings",
        "admin": "admin",
        "database": "bandbook"
      }
};

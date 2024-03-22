// utils/mongodb.js
import { MongoClient } from 'mongodb';

let cached = global.mongo;

if (!cached) cached = global.mongo = {};

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const conn = {};
        cached.promise = MongoClient.connect("mongodb+srv://guest:jhe8vVtxAuYc0OMd@ecommerce.kduaa3f.mongodb.net/productos")
            .then((client) => {
                conn.client = client;
                return client.db(process.env.MONGODB_DB);
            })
            .then((db) => {
                conn.db = db;
                return conn;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
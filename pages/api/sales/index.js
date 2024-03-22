// src/app/pages/api/sales/index.js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case "GET":
      // Obtener todos los productos
      const products = await db.collection("sales").find({}).toArray();
      res.json(products);
      break;
    case "POST":
      // Añadir un nuevo producto
      const count = await db.collection("sales").countDocuments();
      const newProduct = {
        id: count + 1,
        producto: req.body.producto,
        precio: req.body.precio,
        stock: req.body.stock,
      };
      await db.collection("sales").insertOne(newProduct);
      res.status(201).json(newProduct);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

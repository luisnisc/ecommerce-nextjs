"use client";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

/**
 * Componente para el formulario de creación de productos.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setData - Función para actualizar los datos de productos.
 * @returns {JSX.Element} - Elemento JSX que representa el formulario de creación.
 */
export default function FormularioCreacion({ setData }) {
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  /**
   * Maneja el envío del formulario.
   * @param {Event} event - Evento de envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ producto, precio, stock }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log(
          "Producto: " +
            producto +
            " Precio: " +
            precio +
            " Stock: " +
            stock +
            " añadido"
        );
        const newProduct = await response.json();
        console.log(newProduct);

        Swal.fire({
          title: "Producto Creado",
          text: "",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#a5dc86",
          background: "#272727",
          customClass: {
            confirmButton: "sweet-alert-button",
            title: "sweet-alert-title",
            content: "sweet-alert-content",
          },
        }).then(() => {
          setData((prevData) => [...prevData, newProduct]);
          setProducto("");
          setPrecio("");
          setStock("");
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    /**
     * Obtiene los datos de productos desde el servidor.
     */
    const fetchData = async () => {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3 className="text-2xl">
        <AddIcon />
        Nuevo Producto
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-x-1 gap-y-2 mt-2 ml-2">
          <label
            htmlFor="producto"
            className="col-span-1"
          >
            Producto:
          </label>
          <input
            id="producto"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="text"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
          />
          <label
            htmlFor="precio"
            className="col-span-1"
          >
            Precio:
          </label>
          <input
            id="precio"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <label
            htmlFor="stock"
            className="col-span-1"
          >
            Stock:
          </label>
          <input
            id="stock"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-green-300 p-2 rounded-md text-white hover:bg-green-600 mt-6 ml-16"
            type="submit"
          >
            Agregar producto
          </button>
        </div>
      </form>
    </div>
  );
}

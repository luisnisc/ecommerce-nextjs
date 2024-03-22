"use client";
/**
 * Componente de formulario de edición.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setData - Función para actualizar los datos de la tabla.
 * @param {Function} props.setUpdate - Función para actualizar el estado de actualización de la tabla.
 * @param {boolean} props.update - Estado de actualización de la tabla.
 * @returns {JSX.Element} Elemento JSX que representa el formulario de edición.
 */
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
export default function FormularioEdicion({ setData, setUpdate, update }) {
  // Estados para los valores del formulario
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editProducto, setEditProducto] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editProduct, setEditProduct] = useState("");

  /**
   * Maneja el evento de edición del formulario.
   *
   * @param {Event} event - Evento del formulario.
   * @returns {Promise<void>} Promesa vacía.
   */
  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      // Crea el cuerpo de la solicitud con los valores editados
      const body = {
        producto: editProducto,
        precio: editPrecio,
        stock: editStock,
      };
      // Elimina las propiedades vacías del cuerpo
      Object.keys(body).forEach((key) => body[key] === "" && delete body[key]);

      // Realiza la solicitud PUT al servidor
      const response = await fetch(`/api/sales/${editProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error response body:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log(
          "Producto: " +
            producto +
            " Precio: " +
            precio +
            " Stock: " +
            stock +
            " editado"
        );
        const newProduct = await response.json();
        console.log(newProduct);

        // Muestra una alerta de éxito y actualiza los datos de la tabla
        Swal.fire({
          title: "Producto Editado",
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
          // Cambia el estado 'update' para forzar una actualización de la tabla
          setData((prevData) => {
            return prevData.map((item) =>
              item.id === newProduct.id ? newProduct : item
            );
          });
          setUpdate((prevUpdate) => !prevUpdate);
          setEditProduct("");
          setEditProducto("");
          setEditPrecio("");
          setEditStock("");
        });
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(editProduct);
    }
  };

  // Realiza la solicitud GET al servidor para obtener los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/sales");
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, [update]);

  return (
    <div id="editForm">
      <h3 className="text-2xl">
        <EditIcon />
        Editar Producto
      </h3>
      <form onSubmit={handleEdit}>
        <div className="grid grid-cols-3 gap-x-1 gap-y-2 mt-2 ml-2">
          <label
            htmlFor="editProduct"
            className="col-span-1"
          >
            ID Producto:
          </label>
          <input
            id="editProduct"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="text"
            required={true}
            value={editProduct}
            onChange={(e) => setEditProduct(e.target.value)}
          />
          <label
            htmlFor="editProducto"
            className="col-span-1"
          >
            Nombre:
          </label>
          <input
            id="editProducto"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="text"
            value={editProducto}
            onChange={(e) => setEditProducto(e.target.value)}
          />
          <label
            htmlFor="editPrecio"
            className="col-span-1"
          >
            Precio:
          </label>
          <input
            id="editPrecio"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="number"
            step="0.01"
            value={editPrecio}
            onChange={(e) => setEditPrecio(e.target.value)}
          />
          <label
            htmlFor="editStock"
            className="col-span-1"
          >
            Stock:
          </label>
          <input
            id="editStock"
            className="border-2 border-gray-500 rounded-md p-1 text-black w-48 col-span-2"
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-300 p-2 rounded-md text-white hover:bg-blue-600"
            type="submit"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

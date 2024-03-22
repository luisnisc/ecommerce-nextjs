"use client";
/**
 * Componente de tabla que muestra una lista de productos.
 * Permite ordenar los productos por diferentes campos, exportar la lista a JSON,
 * eliminar productos y paginar la tabla.
 *
 * @component
 * @example
 */
import { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import FormularioCreacion from "./formularios/FormularioCreacion";
import FormularioEdicion from "./formularios/FormularioEdicion";
import Swal from "sweetalert2";

import "./Tabla.css";

export default function Tabla({ initialData }) {
  const [data, setData] = useState(initialData || []); // Estado para almacenar los datos de la tabla
  const [update, setUpdate] = useState(false); // Estado para actualizar la tabla
  const [sortField, setSortField] = useState("id"); // Estado para el campo de ordenación
  const [sortArrow, setSortArrow] = useState(false); // Estado para la dirección de ordenación
  const [sortDirection, setSortDirection] = useState("asc"); // Estado para la dirección de ordenación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [itemsPerPage, setItemsPerPage] = useState(10); // Estado para la cantidad de elementos por página

  /**
   * Maneja el evento de ordenación de la tabla.
   * @param {string} field - El campo por el cual se va a ordenar la tabla.
   */
  const handleSort = (field) => {
    let direction = "asc";
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    }
    setSortField(field);
    setSortDirection(direction);
    setSortArrow(!sortArrow);
  };

  let sortedProducts = [...data];
  if (sortField !== null) {
    sortedProducts.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Exporta los datos de la tabla a un archivo JSON.
   */
  const exportToJson = () => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
  };

  /**
   * Maneja el evento de eliminación de un producto.
   * @param {number} id - El ID del producto a eliminar.
   */
  const handleDelete = async (id) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: '<p style="color: #ffffff;">Algo a salido mal!</p>',
          footer: '<p style="color: #ffffff;">Producto no encontrado</p>',
          confirmButtonText: "OK",
          confirmButtonColor: "#de6d6d",
          background: "#272727",
          customClass: {
            confirmButton: "sweet-alert-button",
            title: "sweet-alert-title",
            content: "sweet-alert-content",
          },
        });
      } else {
        console.log(`Producto: ${id} eliminado`);

        Swal.fire({
          title: "Producto Eliminado",
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
          const deleteProductId = Number(id);
          const newData = data.filter(
            (product) => product.id !== deleteProductId
          );
          setData(newData);

          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const currentPageData = newData.slice(startIndex, endIndex);

          if (currentPageData.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    /**
     * Realiza una llamada a la API para obtener los datos de la tabla.
     * Se ejecuta una vez al cargar el componente.
     */
  };
  useEffect(() => {
    if (initialData && JSON.stringify(initialData) !== JSON.stringify(data)) {
      setData(initialData);
    }
  }, [initialData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div
      id="padre"
      className="bg-gray-700 text-gray-300 rounded-md pl-6 pr-6 pt-4 pb-1 min-h-max"
    >
      <button
        className="bg-blue-300 p-2 rounded-md text-white hover:bg-blue-600 mb-4"
        onClick={exportToJson}
      >
        JSON
      </button>
      <div className="flex justify-center items-center content-center  ">
        <table>
          <thead>
            <tr className="bg-gray-800">
              <th className="w-2 text-left px-2"></th>
              <th className="text-left px-2" onClick={() => handleSort("id")}>
                ID Producto
                {sortField === "id" ? (
                  sortDirection === "asc" ? (
                    <ArrowDownwardIcon />
                  ) : (
                    <ArrowUpwardIcon />
                  )
                ) : (
                  <>
                    <ArrowUpwardIcon />
                    <ArrowDownwardIcon />
                  </>
                )}
              </th>
              <th className="text-left px-2" onClick={() => handleSort("producto")}>
                Producto
                {sortField === "producto" ? (
                  sortDirection === "asc" ? (
                    <ArrowDownwardIcon />
                  ) : (
                    <ArrowUpwardIcon />
                  )
                ) : (
                  <>
                    <ArrowUpwardIcon />
                    <ArrowDownwardIcon />
                  </>
                )}
              </th>
              <th className="text-left px-2" onClick={() => handleSort("precio")}>
                Precio
                {sortField === "precio" ? (
                  sortDirection === "asc" ? (
                    <ArrowDownwardIcon />
                  ) : (
                    <ArrowUpwardIcon />
                  )
                ) : (
                  <>
                    <ArrowUpwardIcon />
                    <ArrowDownwardIcon />
                  </>
                )}
              </th>
              <th className="text-left px-2" onClick={() => handleSort("stock")}>
                Stock
                {sortField === "stock" ? (
                  sortDirection === "asc" ? (
                    <ArrowDownwardIcon />
                  ) : (
                    <ArrowUpwardIcon />
                  )
                ) : (
                  <>
                    <ArrowUpwardIcon />
                    <ArrowDownwardIcon />
                  </>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-500">
            {currentItems.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-700 transition-all"
              >
                <td className="text-left px-2">
                  <button onClick={() => handleDelete(product.id)}>
                    <DeleteForeverIcon
                      sx={{
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </button>
                </td>
                <td className="text-left px-2">{product.id}</td>
                <td className="text-left px-2">{product.producto}</td>
                <td className="text-left px-2">{parseFloat(product.precio).toFixed(2)}€</td>
                <td className="text-left px-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <div className="flex items-centerw-max mt-1 justify-start">
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>
              <ArrowCircleLeftIcon />
            </button>
          )}
          <span
            id="currentPage"
            className="px-2 bg-white text-black rounded-full ml-1 mr-1 mt-0.5"
          >
            {currentPage}
          </span>
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              <ArrowCircleRightIcon />
            </button>
          )}
        </div>
      <div className=" grid grid-cols-2 grid-rows-1 w-max gap-20 pb-4">
        <FormularioCreacion setData={setData} />
        <FormularioEdicion
          setData={setData}
          setUpdate={setUpdate}
          update={update}
        />
      </div>
    </div>
  );
}
export async function getServerSideProps() {
  const response = await fetch("/api/sales/");
  const initialData = await response.json();

  return {
    props: {
      initialData,
    },
  };
}

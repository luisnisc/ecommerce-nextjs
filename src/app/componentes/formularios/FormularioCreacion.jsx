"use client"
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
                <div className="mt-2 ml-2">
                    <label>
                        Producto:
                        <input
                            className="border-2 border-gray-500 rounded-md ml-4 p-1 text-black"
                            type="text"
                            value={producto}
                            onChange={(e) => setProducto(e.target.value)}
                        />
                    </label>
                </div>
                <div className="mt-2 ml-2">
                    <label>
                        Precio:
                        <input
                            className="border-2 border-gray-500 rounded-md ml-9 p-1 text-black"
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </label>
                </div>
                <div className="mt-2 ml-2">
                    <label>
                        Stock:
                        <input
                            className="border-2 border-gray-500 rounded-md ml-11 p-1 text-black"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </label>
                </div>
                <button
                    className="bg-green-300 p-2 rounded-md text-white hover:bg-green-600 mt-6 ml-16"
                    type="submit"
                >
                    Agregar producto
                </button>
            </form>
        </div>
    );
}

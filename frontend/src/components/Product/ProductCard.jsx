import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatNumber } from "../../lib/utils.js";

export default function ProductCard({ product, handleAddToCart, reload }) {

    const [quantity, setQuantity] = useState("1");

    useEffect(() => {
        setQuantity("1");
    }, [reload]);

    return (
        <div className="relative group transition-all duration-300 animate-fade-in">
            <div
                className="relative p-5 rounded-2xl transition-all duration-500
                    bg-gradient-to-br from-orange-500/90 via-amber-500/80 to-orange-400/70
                    backdrop-blur-xl border border-white/10"
            >
                <Link
                    to={`/dashboard/products/${product.id}`}
                    className="block cursor-pointer relative z-10"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-36 h-36 mb-4 rounded-xl overflow-hidden 
                        bg-orange-500/30 backdrop-blur-md
                        border border-white/20 shadow-inner">
                            <img
                                src="https://pointcoffee.id/wp-content/uploads/2023/08/500x500_PC-PRODUCT-04.jpg"
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            {product.name}
                        </h2>
                        <p className="text-lg font-semibold text-white mt-1">
                            Rp{formatNumber(product.price)}
                        </p>
                    </div>
                </Link>

                <div className="mt-4 bg-orange-500/30 backdrop-blur-xl border border-white/30 rounded-xl p-4 
                        shadow-inner relative z-10 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-white/90 font-medium">Stok:</span>
                        <span className="font-semibold text-white">{product.stock}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor={`qty-${product.id}`} className="text-white/90 font-medium">
                            Jumlah:
                        </label>

                        <div className="flex items-center space-x-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((prev) => (Number(prev) > 1 ? Number(prev) - 1 : 1))
                                }
                                className="w-7 h-7 flex items-center justify-center 
                                    rounded-md bg-white/20 border border-white/25 
                                    text-white text-sm font-bold 
                                    hover:bg-white/35 hover:text-gray-900 
                                    transition-all duration-200 shadow-sm"
                            >
                                −
                            </button>

                            <input
                                id={`qty-${product.id}`}
                                type="text"
                                inputMode="numeric"
                                value={quantity}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setQuantity(val === "" ? "" : Number(val));
                                }}
                                className="w-16 px-2 py-1 rounded-md bg-white/25 
                                    text-white text-center border border-white/30
                                    focus:outline-none focus:ring-2 focus:ring-orange-400 
                                    focus:bg-white/50 transition-all duration-200"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((prev) =>
                                        Number(prev) < product.stock ? Number(prev) + 1 : Number(prev)
                                    )
                                }
                                className="w-7 h-7 flex items-center justify-center 
                                    rounded-md bg-white/20 border border-white/25 
                                    text-white text-sm font-bold 
                                    hover:bg-white/35 hover:text-gray-900 
                                    transition-all duration-200 shadow-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => handleAddToCart(product, quantity)}
                        disabled={product.stock === 0}
                        className={`w-full mt-3 py-2 rounded-lg font-semibold text-white flex items-center justify-center shadow-md transition-all duration-300 ${product.stock === 0
                            ? "bg-gray-400/40 cursor-not-allowed"
                            : "bg-orange-600/50 backdrop-blur-md border border-white/20 hover:bg-orange-600/80"
                            }`}
                    >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    )
}

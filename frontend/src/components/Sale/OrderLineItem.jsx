import { formatNumber } from "../../lib/utils.js";

export default function OrderLineItem({ orderLineItems, setOrderLineItems, subtotal, discount, tax, total, handleOrderSubmit }) {

    function increaseQuantity(productId) {
        setOrderLineItems(draft => {
            const index = draft.findIndex(item => item.product_id === productId);
            if (index !== -1) draft[index].quantity++;
        });
    }

    function decreaseQuantity(productId) {
        setOrderLineItems(draft => {
            const index = draft.findIndex(item => item.product_id === productId);
            if (index !== -1) draft[index].quantity = Math.max(1, draft[index].quantity - 1);
        });
    }

    function removeOrderLineItem(productId) {
        setOrderLineItems(draft => {
            const index = draft.findIndex(item => item.product_id === productId);
            if (index !== -1) draft.splice(index, 1);
        });
    }

    return (
        <div
            className="w-full lg:w-1/3 self-start
                    relative overflow-hidden 
                    bg-gradient-to-br from-orange-400/40 via-amber-400/30 to-orange-300/20 
                    backdrop-blur-2xl border border-white/30 rounded-2xl p-5 
                    transition-all duration-500 flex flex-col justify-between"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-orange-600/10 opacity-40 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h2 className="text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    Current Order
                </h2>
                <button
                    className="text-sm px-3 py-1 rounded-md 
                            bg-white/20 border border-white/30 
                            text-white font-medium hover:bg-white/40 hover:text-gray-900 
                            transition-all duration-200 shadow-sm"
                    onClick={() => setOrderLineItems([])}
                >
                    Clear All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-orange-400/40 scrollbar-track-transparent">
                {orderLineItems.length === 0 ? (
                    <p className="text-white/80 text-center italic">Keranjang kosong</p>
                ) : (
                    orderLineItems.map((item) => (
                        <div
                            key={item.product_id}
                            className="relative grid grid-cols-1 md:grid-cols-[3fr_1fr_2fr] items-center justify-between
                                bg-gradient-to-r from-orange-400/30 via-orange-300/25 to-orange-200/20 
                                rounded-xl p-3 border border-white/30 
                                backdrop-blur-md shadow-inner"
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://pointcoffee.id/wp-content/uploads/2023/08/500x500_PC-PRODUCT-04.jpg"
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-white/40"
                                />
                                <div>
                                    <p className="text-white font-semibold text-sm">{item.name}</p>
                                    <p className="text-amber-100 text-xs">
                                        Rp{formatNumber(item.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    className="w-6 h-6 flex items-center justify-center 
                                            bg-white/25 border border-white/30 
                                            text-white rounded-md text-xs font-bold 
                                            hover:bg-white/50 hover:text-gray-900 
                                            transition-all duration-200"
                                    onClick={() => decreaseQuantity(item.product_id)}
                                >
                                    −
                                </button>
                                <span className="text-white font-medium text-sm w-5 text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    className="w-6 h-6 flex items-center justify-center 
                                            bg-white/25 border border-white/30 
                                            text-white rounded-md text-xs font-bold 
                                            hover:bg-white/50 hover:text-gray-900 
                                            transition-all duration-200"
                                    onClick={() => increaseQuantity(item.product_id)}
                                >
                                    +
                                </button>
                            </div>

                            <p className="text-white text-right font-semibold text-sm mr-4">
                                Rp{formatNumber(item.price * item.quantity)}
                            </p>

                            <button
                                onClick={() => removeOrderLineItem(item.product_id)}
                                className="absolute top-2 right-2 text-white/70 hover:text-white text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-5 border-t border-white/30 pt-4 space-y-2 text-white/90 text-sm relative z-10">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp{formatNumber(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Discount (0%)</span>
                    <span>- Rp{formatNumber(discount)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (11%)</span>
                    <span>+ Rp{formatNumber(tax)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-base border-t border-white/20 pt-2">
                    <span>Total</span>
                    <span>Rp{formatNumber(total)}</span>
                </div>

                <button
                    className="w-full mt-4 py-2 rounded-lg font-semibold text-white 
                            bg-gradient-to-r from-orange-600/90 to-orange-500/90 
                            hover:from-orange-600 hover:to-orange-500 
                            transition-all duration-300 flex items-center justify-center"
                    onClick={handleOrderSubmit}
                >
                    <i className="fas fa-print mr-2"></i> Create Order
                </button>
            </div>
        </div>
    );
}

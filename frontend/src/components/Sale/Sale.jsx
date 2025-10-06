import { useLocalStorage } from "react-use";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert.js";
import { productList } from "../../lib/api/ProductApi.js";
import { formatNumber } from "../../lib/utils.js";
import ProductCard from "../Product/ProductCard";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { orderCreate } from "../../lib/api/OrderApi.js";
import OrderLineItem from "./OrderLineItem.jsx";

export default function Sale() {

    const [products, setProducts] = useState([]);
    const [orderLineItems, setOrderLineItems] = useImmer([]);
    const [token, _] = useLocalStorage("token", "");
    const username = token ? (JSON.parse(atob(token.split('.')[1]))).username : null;
    const [reload, setReload] = useState(false);

    const subtotal = orderLineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.round(subtotal * 0.0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal - discount + tax;

    function handleAddToCart(product, quantity) {
        setOrderLineItems((draft) => {
            const index = draft.findIndex(item => item.product_id === product.id);

            if (index !== -1) {
                draft[index].quantity = quantity;
                return;
            }

            const orderLineItem = {
                product_id: product.id,
                quantity: quantity,
                price: product.price,
                name: product.name,
                stock: product.stock
            }

            draft.push(orderLineItem);
        });
    }

    async function handleOrderSubmit() {
        if (!await alertConfirm("Are you sure you want to submit this order?")) {
            return;
        }

        const response = await orderCreate(token, { username, orderLineItems });
        const responseBody = await response.json();

        if (response.status === 200) {
            await alertSuccess(responseBody.message);
            setReload(!reload);
        } else {
            await alertError(responseBody.errors);
        }
    }

    async function fetchProducts() {
        const response = await productList(token, { page: 1, limit: 10 });
        const responseBody = await response.json();

        if (response.status === 200) {
            setProducts(responseBody.data);
        } else {
            await alertError(responseBody.message);
        }
    }

    useEffect(() => {
        setOrderLineItems([]);
        fetchProducts();
    }, [reload]);

    return <>
        <div className="flex items-center mb-6">
            <i className="fas fa-cart-shopping text-white text-2xl mr-3"></i>
            <h1 className="text-2xl font-bold text-white">Sales</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* =================== LIST PRODUCT =================== */}
            <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                stock: product.stock
                            }}
                            handleAddToCart={handleAddToCart}
                            reload={reload}
                        />
                    ))}
                </div>
            </div>

            {/* =================== CURRENT ORDER =================== */}
            <OrderLineItem
                orderLineItems={orderLineItems}
                setOrderLineItems={setOrderLineItems}
                subtotal={subtotal}
                discount={discount}
                tax={tax}
                total={total}
                handleOrderSubmit={handleOrderSubmit}
            />
        </div>
    </>
}
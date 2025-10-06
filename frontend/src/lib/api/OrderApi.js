export const orderCreate = async (token, { username, orderLineItems }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/${username}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            username,
            order_line_items: orderLineItems
        })
    });
}

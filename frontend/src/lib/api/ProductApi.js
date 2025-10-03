export const productCreate = async (token, {name, price, stock, categoryId}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            price: price,
            stock: stock,
            category_id: categoryId
        })
    });
}

export const productList = async (token, { page, limit, categoryId, name } = {}) => {
    const url = new URL(`${import.meta.env.VITE_API_PATH}/products`);

    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);
    if (categoryId) url.searchParams.append('category_id', categoryId);
    if (name) url.searchParams.append('name', name);

    return await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export const productDelete = async (token, id) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export const productUpdate = async (token, id, {name, price, stock, categoryId}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/products/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            price: price,
            stock: stock,
            category_id: categoryId
        })
    });
}

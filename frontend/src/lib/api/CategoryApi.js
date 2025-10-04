export const createCategory = async (token, {name}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name
        })
    });
}

export const categoryList = async (token, {page, limit} = {}) => {
    const url = new URL(`${import.meta.env.VITE_API_PATH}/categories`);

    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);

    return await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export const categoryDelete = async (token, categoryId) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

export const categoryUpdate = async (token, categoryId, {name}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name
        })
    });
}

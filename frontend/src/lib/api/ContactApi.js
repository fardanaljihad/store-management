export const createContact = async (token, username, { first_name, last_name, email, phone }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/${username}/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            phone
        })
    });
}

export const getContact = async (token, username) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/${username}/contacts`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const updateContact = async (token, username, { first_name, last_name, email, phone }) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/${username}/contacts`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            phone
        })
    });
}


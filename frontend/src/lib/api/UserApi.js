export const userRegister = async ({username, password, role = "CASHIER"}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username, 
            password, 
            role
        })
    });
}

export const userLogin = async ({username, password}) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username, 
            password
        })
    });
}

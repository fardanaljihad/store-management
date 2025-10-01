import { useNavigate } from "react-router";
import { useEffectOnce, useLocalStorage } from "react-use";

export default function UserLogout() {

    const [_, setToken] = useLocalStorage("token", "");
    const navigate = useNavigate();

    function handleLogout() {
        setToken("");
        navigate({
            pathname: "/login"
        });
    }

    useEffectOnce(() => {
        handleLogout();
    }); 

    return <>
    </>
}
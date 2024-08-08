import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    let token = sessionStorage.getItem("token");
    useEffect(() => {
        const verifyCookie = async () => {
            if (!token) {
                navigate("/login");
            }
            const { data } = await axios.post(
                "http://localhost:4000",
                {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                },
                { withCredentials: true }
            );
            const { status, user } = data;
            setUsername(user);
            return status
                ? toast(`Hello ${user}`, {
                    position: "top-right",
                })
                : navigate("/login");
        };
        verifyCookie();
    }, []);
    const Logout = () => {
        sessionStorage.clear();
        navigate("/signup");
    };
    return (
        <>
            <div className="home_page">
                <h4>
                    {" "}
                    Welcome <span>{username}</span>
                </h4>
                <button onClick={Logout}>LOGOUT</button>
            </div>
            <ToastContainer />
        </>
    );
};

export default Home;
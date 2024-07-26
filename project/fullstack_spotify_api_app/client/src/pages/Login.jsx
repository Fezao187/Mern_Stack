import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, FloatingLabel, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "../App.css";

function Login({ setIsAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    let navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5000/login",
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );
            console.log(data);
            const { success, message } = data;
            if (success) {
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/");
                console.log(message);
            } else {
                console.log(message);
            }

        } catch (error) {
            setErrMsg(error.message);
        }
    }

    return (
        <>
            <div className="container1">
                <div className="center">
                    <Form>
                        <h1>Login</h1>
                        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>
                        <br />
                        {errMsg !== "" && <Alert variant="danger" dismissible>{errMsg}</Alert>}
                        <Button variant="outline-primary" type="submit" onClick={handleLogin}>
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default Login;
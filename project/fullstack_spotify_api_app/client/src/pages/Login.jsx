import React, { useState } from "react";
import { auth, provider } from "../firebase_config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Form, FloatingLabel,Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "../App.css";

function Login({ setIsAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("")
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            localStorage.setItem("isAuth", true);
            setIsAuth(true);
            navigate("/");
        } catch (error) {
            setErrMsg(error.message);
        }
    }
    let navigate = useNavigate();
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/");
            })
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
                        {errMsg!==""&&<Alert variant="danger" dismissible>{errMsg}</Alert>}
                        <Button variant="outline-primary" type="submit" onClick={handleLogin}>
                            Submit
                        </Button>
                        <hr />
                        <Button variant="outline-warning" onClick={signInWithGoogle}>
                            Sign In with Google
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default Login;
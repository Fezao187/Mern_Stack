import axios from "axios";
import React, { useState } from "react";
import { Button, Form, FloatingLabel, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    let navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5000/signup",
                {
                    name,
                    email,
                    username,
                    password
                },
                { withCredentials: true }
            );
            console.log(data);
            console.log("Sign up complete");
            navigate("/login/page");
        } catch (error) {
            setErrMsg(error.message);
        }
    }

    return (
        <>
            <div className="container1">
                <div className="center">
                    <Form>
                        <h1>Sign Up</h1>
                        <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                            <Form.Control type="text" placeholder="name@example.com" onChange={(e) => setName(e.target.value)} required />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                            <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                            <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </FloatingLabel>
                        <br />
                        {errMsg !== "" && <Alert variant="danger" dismissible>{errMsg}</Alert>}
                        <Button variant="outline-primary" type="submit" onClick={handleSignUp}>
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Signup;
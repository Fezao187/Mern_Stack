import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Button, Form, FloatingLabel, Alert } from "react-bootstrap";
import { auth, db, provider } from "../firebase_config";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup({ setIsAuth }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    let navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            await updateProfile(user, {
                displayName: name
            });
            console.log(user);
            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    name: name,
                });
            }
            console.log("Sign up complete");
            navigate("/login/page");
        } catch (error) {
            setErrMsg(error.message);
        }
    }
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem("isAuth", true);
                setIsAuth(true);
                navigate("/");
            });
    }
    return (
        <>
            <div className="container1">
                <div className="center">
                    <Form>
                        <h1>Sign Up</h1>
                        <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                            <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setName(e.target.value)} required />
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

export default Signup;
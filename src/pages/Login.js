import { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const notyf = new Notyf();

    useEffect(() => {
        setButtonEnabled(email && password);
    }, [email, password]);

    function authenticate(e) {
        e.preventDefault();
        fetch("https://fitnessapp-api-ln8u.onrender.com/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Login response data:", data);
            if (data.access) {
                localStorage.setItem("token", data.access);
                setUser({ id: data.id, isAdmin: false });  // Set user ID here as needed
                notyf.success("Thank you for logging in.");
                setEmail("");
                setPassword("");
            } else {
                switch (data.message) {
                    case "No email found":
                        notyf.error("Email does not exist.");
                        break;
                    case "Incorrect email or password":
                        notyf.error("Incorrect email or password.");
                        break;
                    case "Invalid email format":
                        notyf.error("Invalid email format.");
                        break;
                    default:
                        notyf.error("Something went wrong.");
                }
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            notyf.error("Something went wrong.");
        });
    }

    return (
        user.id !== null ? (
            <Navigate to="/workout" />
        ) : (
            <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center text-white">Login</h1>

                <Form.Group>
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                        className="form-control"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                        className="form-control"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-4 custom-button"
                    disabled={!buttonEnabled}
                >
                    Submit
                </Button>
            </Form>
        )
    );
}

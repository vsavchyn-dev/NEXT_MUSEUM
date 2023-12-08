import { Card, Form, Alert, Button } from "react-bootstrap";
import { registerUser } from "@/lib/authenticate";
import { useRouter } from "next/router";
import { useState } from 'react';

export default function Login(props) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const [password2, setPassword2] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user || !password) {
            setWarning('Please fill in all fields');
            return;
        }
        try {
            await registerUser(user, password, password2);
            router.push('/login');
        } catch (err) {
            setWarning(err.message);
        }
    }
    return (
        <>
            <Card bg="light">
                <Card.Body><h2>Register</h2>Register for account:</Card.Body>
            </Card>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>User:</Form.Label><Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label><Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Repeat Password:</Form.Label><Form.Control type="password" value={password2} id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
                </Form.Group>
                <br />
                <Button variant="primary" className="pull-right" type="submit">Register</Button>
            </Form>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
        </>
    );
}
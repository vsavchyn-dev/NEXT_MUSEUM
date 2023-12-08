import { Card, Form, Alert, Button } from "react-bootstrap";
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from "next/router";
import { useState } from 'react';

import { getFavourites, getHistory } from "@/lib/userData";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";

export default function Login(props) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistoryList, setSearchHistoryList] = useAtom(searchHistoryAtom);
    const router = useRouter();

    async function updateAtom() {
        setFavouritesList(await getFavourites());
        setSearchHistoryList(await getHistory());
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await authenticateUser(user, password);
            await updateAtom();
            router.push('/favourites');
        } catch (err) {
            setWarning(err.message);
        }
    }
    return (
        <>
            <Card bg="light">
                <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
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
                <br />
                {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                <br />
                
                <Button variant="primary" className="pull-right" type="submit">Login</Button>
            </Form>

        </>
    );
}
import { Nav, Navbar, Form, FormControl, Button, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { removeToken, readToken } from "@/lib/authenticate";

export default function MainNav() {
    const [searchHistoryList, setSearchHistory] = useAtom(searchHistoryAtom);
    const [isExpanded, setExpanded] = useState(false);
    const router = useRouter();

    let token = readToken();

    const logout = () => {
        setExpanded(false);
        removeToken();
        router.push('/');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const searchField = e.target.elements.search.value;

        setExpanded(false);
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
        router.push(`/artwork?title=true&q=${searchField}`);
    };

    return (
        <>
            <Navbar expand="lg" className="fixed-top bg-body-tertiary" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand>&quot;The Met&quot; exhibits</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!isExpanded)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {token ?
                            (
                                <>
                                    <Nav className="me-auto">
                                        <Link href="/" passHref legacyBehavior>
                                            <Nav.Link active={router.pathname === "/"} onClick={() => setExpanded(false)}>Home</Nav.Link>
                                        </Link>
                                        <Link href="/search" passHref legacyBehavior>
                                            <Nav.Link active={router.pathname === "/search"} onClick={() => setExpanded(false)}>Advanced search</Nav.Link>
                                        </Link>
                                    </Nav>
                                    <Form className="d-flex" onSubmit={handleSubmit}>
                                        <FormControl type="text" placeholder="Search" name="search" />&nbsp;
                                        <Button type="submit">Search</Button>
                                    </Form>
                                    <Nav>
                                        <NavDropdown title={token?.userName} id="nav-dropdown">
                                            <Link href="/favourites" passHref legacyBehavior>
                                                <NavDropdown.Item active={router.pathname === "/favourites"} onClick={() => setExpanded(false)}>Favourites</NavDropdown.Item>
                                            </Link>
                                            <Link href="/history" passHref legacyBehavior>
                                                <NavDropdown.Item active={router.pathname === "/history"} onClick={() => setExpanded(false)}>History</NavDropdown.Item>
                                            </Link>
                                            <Link href="/" passHref legacyBehavior>
                                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                            </Link>
                                        </NavDropdown>
                                    </Nav>
                                </>
                            )
                            :
                            (
                                <>
                                    <Nav className="me-auto">
                                        <Link href="/" passHref legacyBehavior>
                                            <Nav.Link active={router.pathname === "/"} onClick={() => setExpanded(false)}>Home</Nav.Link>
                                        </Link>
                                    </Nav>
                                    <Nav>
                                        <Link href="/login" passHref legacyBehavior>
                                            <Nav.Link active={router.pathname === "/login"} onClick={() => setExpanded(false)}>Login</Nav.Link>
                                        </Link>
                                        <Link href="/register" passHref legacyBehavior>
                                            <Nav.Link active={router.pathname === "/register"} onClick={() => setExpanded(false)}>Register</Nav.Link>
                                        </Link>
                                    </Nav>
                                </>
                            )
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
        </>
    )
}
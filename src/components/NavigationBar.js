import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function NavigationBar() {
  const { logout } = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  async function updateRefrence() {
    setLoading(true);
    try {
      const snapshot = await db.collection("current").get();
      const docId = snapshot.docs[0].id;
      await db.collection("current").doc(docId).update({ refrence: 0 });
    } catch (err) {
      console.log(err);
    }
    history.push("/dashboard");
    setLoading(false);
  }

  async function handleLogout() {
    try {
      await logout();
      history.push("/");
    } catch (err) {
      console.log(err);
      history.push("/");
    }
  }

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container fluid>
          <Navbar.Brand>
            <img
              alt=""
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{ marginRight: "1rem" }}
            />
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#000",
                fontWeight: "500",
              }}
            >
              MEDITRUST LAB
            </Link>
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Link
              className="btn btn-primary"
              to="/dashboard/report"
              style={{ marginRight: "1rem" }}
            >
              New Report
            </Link>

            <Link
              className="btn btn-dark"
              to="/dashboard/search"
              style={{ marginRight: "6rem" }}
            >
              Find Report
            </Link>
            <Button onClick={updateRefrence} disabled={loading}>
              Reset Refrence
            </Button>
            <Link
              className="btn btn-outline-primary"
              to="/dashboard/change-password"
              style={{ marginLeft: "1rem" }}
            >
              Change Password
            </Link>
            <Button
              variant="primary"
              onClick={handleLogout}
              style={{ marginLeft: "1rem" }}
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

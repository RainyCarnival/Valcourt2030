import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import logo from '../logo.png';
import Background from '../components/Background';

export default function LoginPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh" }}>
      <Background/>
      <Card style={{ width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <img
              src={logo} // Replace with your logo path
              alt="Logo"
              style={{ width: '200px' }} // Adjust size as needed
            />
          </Card.Title>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button 
              style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} 
              type="submit" 
              className="w-100 mb-2"
            >
              Login
            </Button>
            <Button variant="secondary" className="w-100">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
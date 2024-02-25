import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import logo from '../logo.png';
import Background from '../components/Background';

export default function LoginPage() {

  const navigate = useNavigate(); // Hook for navigation
  
  const handleLogin = () => {
    //Todo: Add login logic
    //Need to add a check for the user's credentials
    navigate('/userEvent');
  }

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh"}}>
      <Background/>
      <Card style={{ width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              style={{ width: '200px' }} 
            />
          </Card.Title>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Courriel" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Mot de passe" />
            </Form.Group>

            <Button 
              style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} 
              type="submit" 
              className="w-100 mb-2"
              onClick={handleLogin}
            >
              Se connecter
            </Button>
            <Button variant="secondary" className="w-100" onClick={handleSignUpClick}>
              Inscription
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
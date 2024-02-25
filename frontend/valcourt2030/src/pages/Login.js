import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import logo from '../logo.png';
import Background from '../components/Background';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  /**
   * Validates the login form.
   * @returns {boolean} - Returns true if the form is valid, otherwise false.
   */
  const validateForm = () => {
    const { email, password } = values;

    if (email === "") {
      setError('Courriel et mot de passe est requis.')
      return false;
    } else if (password === "") {
      setError('Courriel et mot de passe est requis.')
      return false;
    }
    return true;
  };

  /**
   * Handles the form submission.
   * Sends a login request to the server and processes the response.
   * @param {Object} event - The form submission event.
   */
  const handleLogin = async (event) => { 
    event.preventDefault();

    if (validateForm()) {
      try{
        const { email, password } = values;
        const { data } = await axios.post(loginRoute, {
          email,
          password,
        });
  
        if (data.status) {
          navigate('/userEvent');
        }

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const { status } = error.response;

          if (status === 400) {
            setError('Identifiants de connexion incorrects. \nVeuillez vérifier votre adresse courriel et votre mot de passe.');
          } else if (status === 500) {
            setError('Une erreur interne du serveur s\'est produite. \nVeuillez réessayer plus tard.');
          } else {
            setError(`Erreur inattendue lors de la connexion. \nVeuillez réessayer plus tard.`);
          }
        } else {
          setError(`* Une erreur interne du serveur s'est produite. \nVeuillez réessayer plus tard.`);
        }
      }
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
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
              <Form.Control type="email" placeholder="Courriel" name="email" onChange={(e) => handleChange(e)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Mot de passe" name="password" onChange={(e) => handleChange(e)} />
            </Form.Group>
            {error && (
              <div className="alert alert-danger my-3 py-2" role="alert" style={{ fontSize: 'small' }}>
                {error}
              </div>
            )}
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
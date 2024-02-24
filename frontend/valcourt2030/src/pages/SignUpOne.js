import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Dropdown } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure the logo path is correct
import Background from '../components/Background';

export default function SignUpPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh" }}>
    <Background/>
      <Card style={{ width: '300px', padding: '20px', borderRadius: '15px',backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="2030 Logo"
              style={{ width: '200px' }} // Adjust size as needed
            />
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Control type="text" placeholder="Prénom" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control type="text" placeholder="Nom de famille" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMunicipality">
            <Form.Select defaultValue="Municipalité">
                <option disabled>Municipalité</option>
                <option value="Valcourt">Valcourt</option>
                <option value="Canton de Valcourt">Canton de Valcourt</option>
                <option value="Bonsecours">Bonsecours</option>
                <option value="Lawrenceville">Lawrenceville</option>
                <option value="Maricourt">Maricourt</option>
                <option value="Racine">Racine</option>
                <option value="Sainte-Anne-de-la-Rochelle">Sainte-Anne-de-la-Rochelle</option>
                <option value="MRC du Val-Saint-François">MRC du Val-Saint-François</option>
                <option value="Estrie">Estrie</option>
                <option value="Province de Québec">Province de Québec</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Courriel" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Mot de passe" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Control type="password" placeholder="Mot de passe" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Conditions de services" />
            </Form.Group>

            <div className="d-grid gap-2">              
            <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} 
              type="submit" 
              className="w-100 mb-2">
                Suivant
              </Button>
              <Button variant="secondary" type="button">
              Précédent
              </Button>

            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

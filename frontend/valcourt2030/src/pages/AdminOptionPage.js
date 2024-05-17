import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

const AdminOptionPage = () => {
  // Dummy data for tags, can be fetched from an API or state
  const tags = ['Sport', 'Integration', 'News', 'Cooking', 'French', 'Art', 'Education', 'Business'];

  const navigate = useNavigate();

  const handleHome = () => { navigate('/adminMain') }

  const handleOptiont = () => { navigate('/adminOption') } // Add logic to navigate to about page

  const handleStatistic = () => { navigate('/adminStatistic') } // Add logic to navigate to settings page

  const handleLogout = () => { navigate('/') } // Add logic to logout user

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: 'none', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', width: '100%' }}>
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleHome} style={{ cursor: 'pointer' }}><strong>Mes Activités</strong></Nav.Link>
              <Nav.Link onClick={handleOptiont} style={{ cursor: 'pointer' }}><strong>Options</strong></Nav.Link>
              <Nav.Link onClick={handleStatistic} style={{ cursor: 'pointer' }}><strong>Statistiques</strong></Nav.Link>
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}><strong>Déconnexion</strong></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ position: 'relative', height: "100vh" }}>
        <Background />
        <Container>
          <p />
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="text-center">
                <img
                  src={logo}
                  alt="2030 Logo"
                  className="mb-3"
                  style={{ width: '200px' }}
                />
              </div>
              <div className="mb-3 text-center">
                <h3>Balises Sélectionnées</h3>
                <div>
                  {tags.map((tag, index) => (
                    <Button key={index} style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} className="m-1">
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mb-3 text-center">
                <h3>Municipalité sélectionnée</h3>
                <DropdownButton id="dropdown-basic-button" title="Municipality">
                  <Dropdown.Item href="#/action-1">Municipality 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Municipality 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Municipality 3</Dropdown.Item>
                </DropdownButton>
              </div>
              <div className="text-center mb-3">
                <Button variant="primary">Sauvegarder les Modifications</Button>
              </div>
              <div className="mb-3 text-center">
                <h3>Changer le Mot de Passe</h3>
                <Form>
                  <Form.Group controlId="formNewPassword" className="mb-3">
                    <Form.Control type="password" placeholder="Nouveau Mot de Passe" />
                  </Form.Group>
                  <Form.Group controlId="formReEnterPassword" className="mb-3">
                    <Form.Control type="password" placeholder="Re-Entrer le Mot de Passe" />
                  </Form.Group>
                  <Button variant="primary" type="submit">Changer le Mot de Passe</Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default AdminOptionPage;

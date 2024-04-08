import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Navbar, Nav } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

const UserSettingsPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Assuming you have a list of tags and municipalities (this could also come from an API)
  const tags = ['Sport', 'Integration', 'News', 'Cooking', 'French', 'Art', 'Education', 'Business'];
  const municipalities = ['Municipality 1', 'Municipality 2', 'Municipality 3', 'Other'];

  const handlePasswordChange = (event) => {
    // Add logic for changing password
    event.preventDefault();
    if (password === confirmPassword) {
      console.log('Password changed to: ', password);
      // Proceed with updating the password
    } else {
      console.log('Passwords do not match!');
      // Handle error
    }
  };

  const navigate = useNavigate();

  const handleHome = () => {navigate('/usermain')}

  const handleEvents = () => {navigate('/userevent')} // Add logic to navigate to events page

  const handleAbout = () => {navigate('/userAbout')} // Add logic to navigate to about page

  const handleSettings = () => {navigate('/usersetting')} // Add logic to navigate to settings page

  const handleLogout = () => {navigate('/')} // Add logic to logout user

  return (
    <>        
      <Navbar expand="lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: 'none', boxShadow:'0px 0px 10px rgba(0,0,0,0.1)' , width: '100%' }}>
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link onClick={handleHome} style={{ cursor: 'pointer' }}><strong>Accueil</strong></Nav.Link>
                <Nav.Link onClick={handleEvents} style={{ cursor: 'pointer' }}><strong>Événements</strong></Nav.Link>
                <Nav.Link onClick={handleAbout} style={{ cursor: 'pointer' }}><strong>À propos de nous</strong></Nav.Link>
                <Nav.Link onClick={handleSettings} style={{ cursor: 'pointer' }}><strong>Options</strong></Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}><strong>Déconnexion</strong></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      <Container style={{position: 'relative', height: "100vh"}}>
        <Background />


        <Container>
          <p/>
          <Row className="justify-content-center text-center">
            <Col xs={12} md={6}>
              <img
                src={logo}
                alt="Logo"
                className="mb-4"
                style={{ width: '200px' }}
              />
              <h2>Catégories à sélectionner</h2>
              <div className="mb-4">
                {tags.map((tag, index) => (
                  <Button key={index} variant="secondary" className="m-1">
                    {tag}
                  </Button>
                ))}
              </div>

              <h2>Choix de municipalité</h2>
              <Form.Select aria-label="Municipality select" className="mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', boxShadow:'0px 0px 10px rgba(0,0,0,0.1)' }}>
                {municipalities.map((municipality, index) => (
                  <option key={index} value={municipality}>{municipality}</option>
                ))}
              </Form.Select>
              <Button variant="primary"  style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }}>Sauvegarder</Button>
              <p/>
              <Card  className="mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', boxShadow:'0px 0px 10px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Changer le mot de passe</Card.Title>
                  <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3" controlId="formNewPassword">
                      <Form.Control type="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Control type="password" placeholder="Entrez à nouveau le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit"  style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }}>Sauvegarder</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default UserSettingsPage;

import React from 'react';
import { Navbar, Nav, Container, Row, Col, Card } from 'react-bootstrap';
import logo from '../logo.png'; // Make sure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

function UserEvent() {
  // Placeholder content for events, to be replaced with actual event data
  const event = {
    tag: 'Sport',
    title: 'Sport Event Exemple',
    date: 'XX/XX/XXXX',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.'
  };

  const navigate = useNavigate();

  const handleHome = () => {navigate('/usermain')}

  const handleEvents = () => {navigate('/userevent')} // Add logic to navigate to events page

  const handleAbout = () => {navigate('/userAbout')} // Add logic to navigate to about page

  const handleSettings = () => {navigate('/usersetting')} // Add logic to navigate to settings page

  const handleLogout = () => {navigate('/')} // Add logic to logout user

  return (
    <>
      <Container style={{position: 'relative', height: "100vh"}}>
        <Background />
        <Navbar expand="lg" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleHome} style={{ cursor: 'pointer' }}>Acceile</Nav.Link>
              <Nav.Link onClick={handleEvents} style={{ cursor: 'pointer' }}>Événements</Nav.Link>
              <Nav.Link onClick={handleAbout} style={{ cursor: 'pointer' }}>À propos de nous</Nav.Link>
              <Nav.Link onClick={handleSettings} style={{ cursor: 'pointer' }}>Options</Nav.Link>
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>Déconnection</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="text-center">
                <img
                  src={logo}
                  alt="2030 Logo"
                  className="mb-3" // Adds some space below the logo
                  style={{ width: '200px' }} // Adjust size as needed
                />
                <h1>Évènements à venir</h1>
              </div>
              <Card className="mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', boxShadow:'0px 0px 10px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">{event.tag}</Card.Subtitle>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
                  <Card.Text>{event.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default UserEvent
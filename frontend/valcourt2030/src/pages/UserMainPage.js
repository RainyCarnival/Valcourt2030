import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';
import logo from '../logo.png'; // Make sure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

const UserMainPage = () => {
  // Dummy data for tags, can be fetched from an API or state
  const tags = ['Sport', 'Integration', 'French', 'Business'];

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
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="text-center">
                <img
                  src={logo}
                  alt="2030 Logo"
                  className="mb-3" // Adds some space below the logo
                  style={{ width: '200px' }} // Adjust size as needed
                />
                <h1>Vos événements</h1>
              </div>
              <div className="mb-3">
                {tags.map((tag, index) => (
                  <Button key={index} style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }}  className="m-1">
                    {tag}
                  </Button>
                ))}
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

export default UserMainPage;
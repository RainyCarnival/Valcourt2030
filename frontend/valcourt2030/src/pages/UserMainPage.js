import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';
import logo from '../logo.png'; // Make sure this path is correct
import Background from '../components/Background';

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

  const handleEvents = () => {} // Add logic to navigate to events page

  const handleSettings = () => {} // Add logic to navigate to settings page

  const handleLogout = () => {} // Add logic to logout user

  return (
    <>
      <Container style={{position: 'relative', height: "100vh"}}>
        <Background />
        <Navbar expand="lg" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }}
                  onClick={handleEvents}>Events</Button>
                <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} 
                  onClick={handleSettings}>Settings</Button>
                <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
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
                <h1>Upcoming Events</h1>
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
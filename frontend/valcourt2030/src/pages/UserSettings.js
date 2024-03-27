import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Navbar, Nav } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure this path is correct

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

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container fluid>
          <Nav className="ml-auto">
            <Nav.Link href="#events">Events</Nav.Link>
            <Nav.Link href="#settings">Setting</Nav.Link>
            <Button variant="outline-primary">Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Row className="justify-content-center text-center">
          <Col xs={12} md={6}>
            <img
              src={logo}
              alt="Logo"
              className="mb-4"
              style={{ width: '150px' }}
            />
            <h2>Selected Tags</h2>
            <div className="mb-4">
              {tags.map((tag, index) => (
                <Button key={index} variant="secondary" className="m-1">
                  {tag}
                </Button>
              ))}
            </div>

            <h2>Selected Municipality</h2>
            <Form.Select aria-label="Municipality select" className="mb-3">
              {municipalities.map((municipality, index) => (
                <option key={index} value={municipality}>{municipality}</option>
              ))}
            </Form.Select>
            <Button variant="primary">Save Change</Button>

            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Change Password</Card.Title>
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Control type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Control type="password" placeholder="Re-Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Form.Group>
                  <Button variant="primary" type="submit">Change Password</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserSettingsPage;

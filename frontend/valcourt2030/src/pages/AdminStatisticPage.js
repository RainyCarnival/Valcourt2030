import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Table, ListGroup, Form } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

const AdminStatisticPage = () => {
  const navigate = useNavigate();

  const handleHome = () => { navigate('/adminMain') }

  const handleOption = () => { navigate('/adminOption') }

  const handleStatistic = () => { navigate('/adminStatistic') }

  const handleLogout = () => { navigate('/') }

  const statistics = [
    { field: 'User Number', number: 123 },
    { field: 'Sport', number: 34 },
    { field: 'Integration', number: 73 },
    { field: 'Cooking', number: 21 },
    { field: 'French', number: 81 },
    { field: 'Education', number: 52 },
    { field: 'News', number: 7 },
    { field: 'Art', number: 43 },
  ];

  const tags = ['Sport', 'Integration', 'Cooking', 'French', 'Education', 'News', 'Art', 'Business'];

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: 'none', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', width: '100%' }}>
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleHome} style={{ cursor: 'pointer' }}><strong>Mes Activités</strong></Nav.Link>
              <Nav.Link onClick={handleOption} style={{ cursor: 'pointer' }}><strong>Options</strong></Nav.Link>
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
                <h3>Statistiques</h3>
                <Table striped bordered hover style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}>
                  <thead>
                    <tr>
                      <th>Champ</th>
                      <th>Numbre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.field}</td>
                        <td>{stat.number}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="mb-3 text-center">
                <h3>Champs</h3>
                <ListGroup className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {tags.map((tag, index) => (
                    <ListGroup.Item key={index} style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)', margin: '5px', display: 'inline-block' }}>
                      {tag}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div>
                  <Button variant="primary" className="m-1">Ajouter une étiquette</Button>
                  <Button variant="danger" className="m-1">Supprimer la balise</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default AdminStatisticPage;

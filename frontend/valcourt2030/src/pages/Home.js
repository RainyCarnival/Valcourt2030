import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';
import logo from '../logo.png';
import Background from '../components/Background';
import '../App.css';

//Placeholder data for events
const events = [
  {
    tag: 'Sport',
    title: 'Sport Event Exemple',
    date: 'XX/XX/XXXX',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.'
  },
  {
    tag: 'Integration',
    title: 'Integration Event Exemple',
    date: 'XX/XX/XXXX',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.'
  },
  {
    tag: 'Cuisine',
    title: 'Cuisine Event Exemple',
    date: 'XX/XX/XXXX',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.'
  }
  // Add more event objects here
];

const HomePage = () => {

    const navigate = useNavigate();
  
    const handleLogin = () => {
      navigate('/Login');
    }

    return (
    <Container style={{position: 'relative', height: "100vh"}}>
        <Background />

        <Navbar fixed="top" className="justify-content-end pr-4" style={{ backgroundColor: 'transparent' }}>
        <Container fluid="md" className="justify-content-end bounce">
            <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }}
            onClick={handleLogin}>Se connecter</Button>
        </Container>
        </Navbar>
        <Container style={{ marginTop: '56px' }} fluid="md"> {/* Adjust top margin to account for navbar height */}
            <Row className="justify-content-center text-center">
                <Col xs={12}>
                    <img
                    src={logo}
                    alt="2030 Logo"
                    style={{ width: '200px' }} // Adjust size as needed
                    />
                    <h1>Événement à venirs</h1>
                    <p>Inscrivez-vous pour en savoir plus</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    {events.map((event, index) => (
                        <Card key={index} className="mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', boxShadow:'0px 0px 10px rgba(0,0,0,0.1)' }}>
                            <Card.Body>
                                <Card.Subtitle className="mb-2 text-muted">{event.tag}</Card.Subtitle>
                                <Card.Title>{event.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
                                <Card.Text>{event.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    </Container>
        
    );
  };
  
  export default HomePage;
  
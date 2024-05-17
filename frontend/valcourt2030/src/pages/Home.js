import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';
import logo from '../logo.png';
import Background from '../components/Background';
import '../App.css';
import axios from 'axios';
import { allEventsRoute } from '../utils/APIRoutes';

const HomePage = () => {

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
      getAllEvents()
    }, [])

    const getAllEvents = async() => {
      const { data } = await axios.get(allEventsRoute, {headers:{"ngrok-skip-browser-warning": "69420"}});
      if(data.status){
        setEvents(data.events);
      }
    }

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
                                <Card.Subtitle className="mb-2 text-muted">{event.tags.map((tag, index) => tag.tag).join(', ')}</Card.Subtitle>
                                <Card.Title>{event.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{event.startDate}</Card.Subtitle>
                                <Card.Text>
                                    {event.formUrl && (
                                        <>
                                        <a href={event.formUrl} target="_blank" rel="noreferrer">Cliquez ici pour réserver vos places!</a>
                                        <br/><br/>
                                        </>
                                    )}
                                    {event.description}
                                </Card.Text>
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
  
import React from 'react';
import { Navbar, Nav, Container, Row, Col} from 'react-bootstrap';
import logo from '../logo.png'; // Make sure this path is correct
import Background from '../components/Background';
import { useNavigate } from 'react-router-dom';

function UserAbout() {
    const navigate = useNavigate();

    const handleHome = () => {navigate('/usermain')}
  
    const handleEvents = () => {navigate('/userevent')} 
  
    const handleAbout = () => {navigate('/userAbout')} 
  
    const handleSettings = () => {navigate('/usersetting')} 
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
                  <h1>À propos de nous</h1>
                  <div>
                    <p><strong>La mission</strong></p>
                    <p style={{ textAlign: 'justify' }}>Valcourt 2030 est un organisme à but non lucratif mis sur pied en 2014.</p>
                    <p style={{ textAlign: 'justify' }}>Selon les axes d’intervention identifiés, Valcourt 2030 se veut un contributeur qui accompagne et oriente les citoyens et les différents acteurs dans la réalisation de projets structurants, permettant à la population du Grand Valcourt de bénéficier d’un milieu de vie des plus recherchés, dynamiques et stimulants.</p>
                    <p><strong>La vision</strong></p>
                    <p style={{ textAlign: 'justify' }}>Être reconnu comme un <u>partenaire exemplaire</u> dans le développement d’une communauté, notamment par notre impressionnante contribution à <u>faire du Grand Valcourt un milieu de vie dynamique et inclusif</u>.</p>
                    <p><strong>Axes d’intervention (rôles)&nbsp;de l’organisme</strong></p>
                    <ul style={{ textAlign: 'justify'}}>
                        <li><strong>Réseauteur</strong> : Mettre en relation les acteurs-clés pour la réalisation d’un projet.</li>
                        <li><strong>Guide</strong> : Accompagner le(s) promoteur(s) d’un projet dans la structure de celui-ci.</li>
                        <li><strong>Instigateur</strong> : Initier des projets bénéfiques à la vitalité du milieu.</li>
                        <li><strong>Contributeur</strong> : Veiller à la mise en œuvre et à la réalisation des projets en fonction des rôles établis.</li>
                    </ul>

                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </>
    );
  };

export default UserAbout
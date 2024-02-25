import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure the logo path is correct
import Background from '../components/Background';

export default function SignUpInterestPage() {
  const location = useLocation();
  const initialFormData = location.state?.formData || {
    firstName: '', 
    lastName: '',
    municipality: 'Municipalité',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    navigate('/login');
  }

  const handlePrevious = () => {
    const updatedFormData = {
      ...formData,
      password: '',
      confirmPassword: '',
      terms: false,
    };

    navigate('/signup', { state: { formData: updatedFormData } });
  }

  const interests = [
    { name: 'Sport', value: 'sport' },
    { name: 'Integration', value: 'integration' },
    { name: 'Cuisine', value: 'cooking' },
    { name: 'Français', value: 'french' },
    { name: 'Education', value: 'education' },
    { name: 'Nouvelles', value: 'news' },
    { name: 'Art', value: 'art' },
    { name: 'Entreprise', value: 'business' },
  ];

  const handleSelect = (interestValue) => {
    const currentIndex = selectedInterests.indexOf(interestValue);
    const newSelectedInterests = [...selectedInterests];

    if (currentIndex === -1) {
      newSelectedInterests.push(interestValue);
    } else {
      newSelectedInterests.splice(currentIndex, 1);
    }

    setSelectedInterests(newSelectedInterests);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh" }}>
        <Background/>
      <Card style={{ width: '300px', padding: '20px', borderRadius: '15px',backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'}}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              style={{ width: '200px' }} // Adjust size as needed
            />
          </div>
          <Card.Text className="text-center mb-4">
            Veuillez sélectionner les activités qui vous intéressent!
          </Card.Text>
          <ButtonGroup className="mb-3 d-flex flex-wrap">
            {interests.map((interest) => (
              <ToggleButton
                key={interest.value}
                id={`interest-${interest.value}`}
                type="checkbox"
                variant="outline-secondary"
                value={interest.value}
                checked={selectedInterests.includes(interest.value)}
                onChange={() => handleSelect(interest.value)}
                className="m-1 rounded"
              >
                {interest.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <div className="d-grid gap-2 mt-4">
            <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} type="submit" onClick={handleSubmit}>
            Enregistrer
            </Button>
            <Button variant="secondary" type="button" onClick={handlePrevious}>
            Précédent
            </Button>

          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

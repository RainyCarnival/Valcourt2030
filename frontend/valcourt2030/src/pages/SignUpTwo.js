import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure the logo path is correct
import Background from '../components/Background';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

export default function SignUpInterestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [interestedTags, setInterestedTags] = useState([]);
  const [formData] = useState(location.state?.formData || {});
  const [error, setError] = useState(null);


  useEffect(() => {
    if(!location.state || !location.state.formData) {
      navigate('/signup');
    }
  }, [location.state, navigate])

  const handleSubmit = async (event) => {
    const registerData = {...formData, interestedTags}
    try{
      const { data } = await axios.post(registerRoute, registerData);
  
      if (data.status){
        navigate('/login', { replace: true, state: { message: 'Compte créé, veuillez vous connecter.'} });
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;

        if (status === 400) {
          setError(error.response);
        } else if (status === 500) {
          setError('Une erreur interne du serveur s\'est produite. \nVeuillez réessayer plus tard.');
        } else {
          setError(`Erreur inattendue lors de la connexion. \nVeuillez réessayer plus tard.`);
        }
      } else {
        setError(`* Une erreur interne du serveur s'est produite. \nVeuillez réessayer plus tard.`);
      }
    }
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
    const currentIndex = interestedTags.indexOf(interestValue);
    const newinterestedTags = [...interestedTags];

    if (currentIndex === -1) {
      newinterestedTags.push(interestValue);
    } else {
      newinterestedTags.splice(currentIndex, 1);
    }

    setInterestedTags(newinterestedTags);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh" }}>
        <Background/>
      <Card style={{ width: '400px', padding: '20px', borderRadius: '15px',backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'}}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              style={{ width: '200px' }} // Adjust size as needed
            />
          </div>
          <Card.Text className="text-center mb-4">
            Veuillez sélectionner les activités qui vous intéressent! (Optionnel)
          </Card.Text>
          <ButtonGroup className="mb-3 d-flex flex-wrap">
            {interests.map((interest) => (
              <ToggleButton
                key={interest.value}
                id={`interest-${interest.value}`}
                type="checkbox"
                variant="outline-secondary"
                value={interest.value}
                checked={interestedTags.includes(interest.value)}
                onChange={() => handleSelect(interest.value)}
                className="m-1 rounded"
              >
                {interest.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          {error && (
            <div className="alert alert-danger my-3 py-2" role="alert" style={{ fontSize: 'small' }}>
              {error}
            </div>
          )}
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

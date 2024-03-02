import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure the logo path is correct
import Background from '../components/Background';
import axios from 'axios';
import { allTagsRoute, registerRoute } from '../utils/APIRoutes';

export default function SignUpInterestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tags, setTags] = useState([{tag: '', _id: ''}]);
  const [interestedTags, setInterestedTags] = useState([]);
  const [formData] = useState(location.state?.formData || {});
  const [error, setError] = useState(null);


  useEffect(() => {
    if(!location.state || !location.state.formData) {
      navigate('/signup');
    }

    getAllTags()

  }, [location.state, navigate])

  const getAllTags = async () => {
    const { data } = await axios.get(allTagsRoute);

    if (data.status){
      setTags(data.tags);
    }
  }

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
          setError('Erreur lors de l\'envoi de vos informations. Veuillez réessayer ultérieurement.');
        } else if (status === 401){
          setError('La création du compte a échoué. Veuillez réessayer plus tard.');
        } else if (status === 409) {
          setError('Erreur de création de compte, cet courriel est déjà utilisé.');
        } else if (status === 500) {
          setError('Une erreur interne du serveur s\'est produite. \nVeuillez réessayer plus tard.');
        } else {
          setError(`Erreur inattendue lors de la connexion. Veuillez réessayer plus tard.`);
        }
      } else {
        setError(`Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard.`);
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
            {tags.map((tag) => (
              <ToggleButton
                key={tag._id}
                id={`tag-${tag.tag}`}
                type="checkbox"
                variant="outline-secondary"
                value={tag._id}
                checked={interestedTags.includes(tag._id)}
                onChange={() => handleSelect(tag._id)}
                className="m-1 rounded"
              >
                {tag.tag}
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

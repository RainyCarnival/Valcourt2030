import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import logo from '../logo.png'; // Ensure the logo path is correct
import Background from '../components/Background';

export default function SignUpPage() {
  const errorBackground = '#f7d6db'
  const navigate = useNavigate();
  const location = useLocation();
  const initialFormData = location.state?.formData || {
    firstName: '', 
    lastName: '',
    municipality: 'Municipalite',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  const initialValid = {
    firstName: true, 
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
  }
  
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(initialValid);

  const handlePrevious = () => {
    navigate('/login');
  }

  const validateField = (fieldName, value) => {
    setValid((prevValid) => ({ ...prevValid, [fieldName]: !!value }));
    return !!value;
  };

  const formValidation = () => {
    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return false;
    }
    setError(null);
    return true;
  };

  const emailValidation = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(formData.email)) {
        return true;
    } else {
        return false;
    }
  };

  const passwordValdiation = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (passwordRegex.test(formData.password)) {
      return true
    } else {
      return false
    }
  };

  const retypePasswordValidation = () => {
    if (formData.password !== formData.confirmPassword){
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!formValidation()) {
      setError('Remplissez tous les champs obligatoires.');
      return;
    } 
    else if (!emailValidation()) {
      setValid((prevValid) => ({ ...prevValid, email: false }));
      setError('Veuillez entrer une adresse courriel valide.');
      return;
    } 
    else if(!passwordValdiation()){
      setValid((prevValid) => ({ ...prevValid, password: false }));
      setError('Le mot de passe doit contenir une minimum de 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et avoir une longueur minimum de 8 caractères.');
      return
    } 
    else if (!retypePasswordValidation()){
      setValid((prevValid) => ({ ...prevValid, password: false, confirmPassword: false }));
      setError('Les mots de passe ne correspondent pas.');
      return;
    } 
    else if (!formData.terms){
      setError('Veuillez accepter les termes et conditions.')
      return;
    }

    setError(null);
    navigate('/signupInterest', { state: { formData: formData } });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{position: 'relative', height: "100vh" }}>
    <Background/>
      <Card style={{ width: '300px', padding: '20px', borderRadius: '15px',backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="2030 Logo"
              style={{ width: '200px' }} // Adjust size as needed
            />
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Control type="text" placeholder="*Prénom" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} 
              style={{ backgroundColor: valid.firstName ? '' : errorBackground}}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control type="text" placeholder="*Nom de famille" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ backgroundColor: valid.lastName ? '' : errorBackground }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMunicipality">
            <Form.Select value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})}>  
                <option value="Municipalite" disabled>Municipalité</option>
                <option value="Valcourt">Valcourt</option>
                <option value="Canton de Valcourt">Canton de Valcourt</option>
                <option value="Bonsecours">Bonsecours</option>
                <option value="Lawrenceville">Lawrenceville</option>
                <option value="Maricourt">Maricourt</option>
                <option value="Racine">Racine</option>
                <option value="Sainte-Anne-de-la-Rochelle">Sainte-Anne-de-la-Rochelle</option>
                <option value="MRC du Val-Saint-François">MRC du Val-Saint-François</option>
                <option value="Estrie">Estrie</option>
                <option value="Province de Québec">Province de Québec</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="*Courriel" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ backgroundColor: valid.email ? '' : errorBackground }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="*Mot de passe" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ backgroundColor: valid.password ? '' : errorBackground }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Control type="password" placeholder="*Confirmez le mot de passe" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} style={{ backgroundColor: valid.confirmPassword ? '' : errorBackground }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="*Conditions de services" required checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})}/>
            </Form.Group>
            {error && (
              <div className="alert alert-danger my-3 py-2" role="alert" style={{ fontSize: 'small' }}>
                {error}
              </div>
            )}
            <div className="d-grid gap-2">              
            <Button style={{ backgroundColor: 'rgba(0, 152, 217, 0.5)', borderColor: 'rgba(0, 152, 217, 0.5)' }} 
              type="submit" 
              className="w-100 mb-2"
              onClick={handleSubmit}>
                Suivant
              </Button>
              <Button variant="secondary" type="button" onClick={handlePrevious}>
              Précédent
              </Button>

            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

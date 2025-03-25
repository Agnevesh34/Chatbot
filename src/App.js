import React, { useState, useEffect } from 'react';
import MBTIForm from './components/MBTIForm';
import PurposeForm from './components/PurposeForm';
import PersonalityForm from './components/PersonalityForm';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mbti: '',
    purpose: '',
    personalityAnswers: [],
    personalityTraits: {}
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Check localStorage for existing data
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleNext = (data) => {
    const newData = { ...formData, ...data };
    setFormData(newData);
    setStep(prev => prev + 1);
    localStorage.setItem('userData', JSON.stringify(newData));
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitFinal = async (data) => {
    const finalData = { ...formData, ...data };
    
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        setSubmissionStatus('success');
        localStorage.setItem('userData', JSON.stringify(finalData));
        setTimeout(() => setStep(4), 2000);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Personality Assessment App</h1>
        
        {step === 1 && <MBTIForm onNext={handleNext} />}
        {step === 2 && <PurposeForm onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <PersonalityForm onSubmit={handleSubmitFinal} onBack={handleBack} />}
        {step === 4 && <Chatbot userData={formData} />}

        {submissionStatus === 'success' && (
          <div className="confirmation-message success">
            <p>✓ Data saved successfully! Loading chatbot...</p>
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="confirmation-message error">
            <p>⚠️ Submission failed. Please try again.</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;



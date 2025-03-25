// src/components/FormFlow.js
import React, { useState } from 'react';
import MBTIForm from './MBTIForm';
import PurposeForm from './PurposeForm';
import PersonalityForm from './PersonalityForm';
import Chatbot from './Chatbot';

const FormFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mbti: '',
    purpose: '',
    personalityAnswers: []
  });

  const nextStep = () => setStep(prev => prev + 1);
  
  const handleSubmit = async (finalData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      if (response.ok) {
        nextStep(); // Proceed to chatbot
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  switch(step) {
    case 1:
      return <MBTIForm 
        initialValues={formData}
        onSubmit={(data) => {
          setFormData(prev => ({...prev, ...data}));
          nextStep();
        }}
      />;
      
    case 2:
      return <PurposeForm 
        initialValues={formData}
        onSubmit={(data) => {
          setFormData(prev => ({...prev, ...data}));
          nextStep();
        }}
        onBack={() => setStep(1)}
      />;

    case 3:
      return <PersonalityForm 
        initialValues={formData}
        onSubmit={(data) => {
          const finalData = {...formData, ...data};
          setFormData(finalData);
          handleSubmit(finalData);
        }}
        onBack={() => setStep(2)}
      />;

    case 4:
      return <Chatbot userData={formData} />;

    default:
      return <div>Invalid step</div>;
  }
};

export default FormFlow;
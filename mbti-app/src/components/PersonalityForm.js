import React, { useState } from 'react';

const PersonalityForm = ({ onSubmit, onBack }) => {
  const [answers, setAnswers] = useState([3, 3, 3, 3]); // Default to neutral

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate personality traits
    const traits = {
      extraversion: answers[0] > 3,
      sensing: answers[1] > 3,
      thinking: answers[2] > 3,
      judging: answers[3] > 3
    };
    
    onSubmit({ 
      personalityAnswers: answers,
      personalityTraits: traits // Add traits to submission
    });
  };

  const questions = [
    "I feel energized after spending time with a group of people",
    "I focus more on practical details than imagining possibilities for the future",
    "When making decisions, I prioritize logic and fairness over personal feelings",
    "I prefer to have a detailed plan rather than adapting as I go"
  ];

  return (
    <div className="form-container">
      <h2>Step 3: Personality Assessment</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question">
            <label>
              {question}
              <select
                value={answers[index]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = parseInt(e.target.value);
                  setAnswers(newAnswers);
                }}
                required
              >
                <option value={1}>Strongly Disagree</option>
                <option value={2}>Disagree</option>
                <option value={3}>Neutral</option>
                <option value={4}>Agree</option>
                <option value={5}>Strongly Agree</option>
              </select>
            </label>
          </div>
        ))}
        <div className="form-navigation">
          <button type="button" onClick={onBack}>Back</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PersonalityForm;
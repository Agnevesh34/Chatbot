import React, { useState } from 'react';

const PurposeForm = ({ onNext, onBack }) => {
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ purpose });
  };

  return (
    <div className="form-container">
      <h2>Step 2: App Purpose</h2>
      <form onSubmit={handleSubmit}>
        <label>
          What are you using the app for?
          <select 
            value={purpose} 
            onChange={(e) => setPurpose(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="General">General</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Organization">Organization</option>
          </select>
        </label>
        <div className="form-navigation">
          <button type="button" onClick={onBack}>Back</button>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
};

export default PurposeForm;
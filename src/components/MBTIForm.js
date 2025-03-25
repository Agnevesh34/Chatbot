import React, { useState } from 'react';

const MBTIForm = ({ onNext }) => {
  const [mbti, setMbti] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ mbti });
  };

  return (
    <div className="form-container">
      <h2>Step 1: MBTI Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Do you know your MBTI personality type?
          <select
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
            required
          >
            <option value="">Select your MBTI</option>
            {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
              'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <div className="form-navigation">
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
};

export default MBTIForm;

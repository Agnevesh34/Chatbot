import React, { useEffect, useState } from 'react';

const MBTIInfo = () => {
  const [mbtiData, setMbtiData] = useState([]);

  useEffect(() => {
    fetch('/api/mbti')
      .then(res => res.json())
      .then(data => setMbtiData(data));
  }, []);

  return (
    <div className="mbti-info">
      <h1>MBTI Personality Types</h1>
      {mbtiData.map(type => (
        <div key={type.type} className="mbti-type">
          <h2>{type.type} - {type.name}</h2>
          <p><strong>Category:</strong> {type.category}</p>
          <p><strong>Traits:</strong> {type.traits.join(', ')}</p>
          <p><strong>Description:</strong> {type.description}</p>
          <p><strong>Famous Examples:</strong> {type.famousExamples.join(', ')}</p>
          <div className="strengths-weaknesses">
            <div className="strengths">
              <h3>Strengths</h3>
              <ul>
                {type.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="weaknesses">
              <h3>Weaknesses</h3>
              <ul>
                {type.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MBTIInfo;
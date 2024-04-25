import React from 'react';

const Dates = ({ onSelectDate }) => {

  return (
    <div>
      <label htmlFor="date"></label>
      <input type="date" id="date" onChange={(e) => onSelectDate(e.target.value)} /> <br/>
    </div>
  );
};

export default Dates;
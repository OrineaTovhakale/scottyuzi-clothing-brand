// src/components/Title.jsx
import React from 'react';

const Title = ({ title1, title2, titleStyles = "", title1Styles = "", paraStyles = "", para }) => {
  return (
    <div className={`flex flex-col items-start fly-in-left ${titleStyles}`}>
      <h3 className={`h3 font-thin ${title1Styles}`}>
        {title1}
        <span className="text-secondary font-thin underline ml-2">{title2}</span>
      </h3>
      {para && (
        <p className={`regular-18 text-gray-400 mt-1 ${paraStyles}`}>
          {para}
        </p>
      )}
    </div>
  );
};

export default Title;
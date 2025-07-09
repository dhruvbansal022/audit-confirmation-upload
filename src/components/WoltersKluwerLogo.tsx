
import React from 'react';
import { Link } from 'react-router-dom';

const WoltersKluwerLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/13725959-f7a8-41ca-83b5-465fa83b76e6.png" 
        alt="Wolters Kluwer Logo"
        className="h-10 w-auto" 
        onError={(e) => {
          console.log("Logo failed to load");
          e.currentTarget.style.display = 'none';
        }}
      />
    </Link>
  );
};

export default WoltersKluwerLogo;

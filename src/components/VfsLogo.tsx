
import React from 'react';

const VfsLogo = () => {
  return (
    <div className="flex items-center">
      <img 
        src="/lovable-uploads/13725959-f7a8-41ca-83b5-465fa83b76e6.png" 
        alt="Wolters Kluwer Logo"
        className="h-14 w-auto" 
        onError={(e) => {
          console.log("Logo failed to load");
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default VfsLogo;

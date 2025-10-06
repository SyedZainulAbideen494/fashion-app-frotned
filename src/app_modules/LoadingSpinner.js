// src/components/LoadingSpinner.js

import React from 'react';
import './LoadingSpinner.css'; // Create this CSS file for spinner styles

const LoadingSpinner = () => {
    return (
<div className="newtons-cradle">
<div className="newtons-cradle__dot"></div>
<div className="newtons-cradle__dot"></div>
<div className="newtons-cradle__dot"></div>
<div className="newtons-cradle__dot"></div>
</div>
    );
};

export default LoadingSpinner;

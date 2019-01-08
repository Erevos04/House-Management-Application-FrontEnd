import React from 'react';

const Loading = () =>(
  <div className="k-loading-mask">
      <span className="k-loading-text">Loading</span>
      <div style={{color:'#4c9830'}} className="k-loading-image"></div>
      <div className="k-loading-color"></div>
  </div>
)

export default Loading;
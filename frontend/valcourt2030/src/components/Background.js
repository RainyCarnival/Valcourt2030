import React from 'react';

const Background = () => {
  return (
    <>
      <div style={{
        backgroundColor: '#c9da5c',
        position: 'absolute',
        top: '-6rem',
        right: '11rem',
        height: '50rem',
        width: '100%',
        borderRadius: '50%',
        filter: 'blur(160px)',
        zIndex: -10
      }} />
      <div style={{
        backgroundColor: '#0098d9',
        position: 'absolute',
        top: '0rem',
        left: '-1rem',
        height: '50rem',
        width: '100%',
        borderRadius: '50%',
        filter: 'blur(160px)',
        zIndex: -10
      }} />
    </>
  );
};

export default Background;

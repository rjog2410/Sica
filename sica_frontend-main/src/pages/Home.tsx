import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src="/Imagen.png" alt="Home" style={styles.image} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
    textAlign: 'center',
  } as React.CSSProperties,
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', 
  } as React.CSSProperties,
};

export default Home;

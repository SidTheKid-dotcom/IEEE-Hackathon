import React from 'react';

const ApiUsage: React.FC = () => {
  return (
    <main>
      <h1>API Usage</h1>
      <p>We utilize the PokeAPI to fetch real-time data about Pokemon. Below are examples of API calls made in our application:</p>
      <h2>Get Pokemon List</h2>
      <pre>
        {`
fetch(\`\${process.env.REACT_APP_API_URL}/pokemon?limit=151\`)
  .then(response => response.json())
  .then(data => console.log(data));
        `}
      </pre>
      <h2>Get Pokemon Details</h2>
      <pre>
        {`
fetch(\`\${process.env.REACT_APP_API_URL}/pokemon/\${pokemonName}\`)
  .then(response => response.json())
  .then(data => console.log(data));
        `}
      </pre>
      <h2>Image Recognition API</h2>
      <pre>
        {`
fetch('https://api.imagerecognition.com/identify', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
        `}
      </pre>
    </main>
  );
};

export default ApiUsage;

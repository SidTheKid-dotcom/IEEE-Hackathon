import React from 'react';

const SetupInstallation: React.FC = () => {
  return (
    <main>
      <h1>Setup and Installation</h1>
      <ol>
        <li>Clone the repository:
          <pre>git clone https://github.com/your-repo/pokedex-simulator.git</pre>
        </li>
        <li>Install dependencies:
          <pre>npm install</pre>
        </li>
        <li>Create a <code>.env</code> file and add necessary environment variables:
          <pre>
            {`
REACT_APP_API_KEY=your_api_key
REACT_APP_API_URL=https://pokeapi.co/api/v2/
            `}
          </pre>
        </li>
        <li>Start the development server:
          <pre>npm start</pre>
        </li>
        <li>Build for production:
          <pre>npm run build</pre>
        </li>
      </ol>
    </main>
  );
};

export default SetupInstallation;

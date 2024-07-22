import React from 'react';

const ProjectStructure: React.FC = () => {
  return (
    <main>
      <h1>Project Structure</h1>
      <pre>
        {`
pokedex-simulator/
├── public/
├── src/
│   ├── components/
│   ├── containers/
│   ├── redux/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   └── App.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── webpack.config.js
        `}
      </pre>
      <p>Description of the directory structure and contents.</p>
    </main>
  );
};

export default ProjectStructure;

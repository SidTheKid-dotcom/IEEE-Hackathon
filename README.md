# IEEE Hackathon Project - PISB Branch, PICT

This repository contains the codebase for the Full Stack Web Development project created during the IEEE Hackathon, conducted by the PISB branch at PICT. The project leverages modern web technologies to create an interactive Pokémon-themed platform with various features.

## Project Overview

The web application is built using TypeScript, Node.js, Prisma, Express.js, and PostgreSQL as the backend stack. The frontend was made using React and includes interactive Pokémon features that enhance the user experience, utilizing data from the PokéAPI and additional map integration.

### Key Features

1. **Pokémon Data Integration**:  
   The app fetches data from the PokéAPI, providing users with detailed information about different Pokémon, including their stats, moves, and abilities.

2. **Trivia & Starter Pokémon Assignment**:  
   The app includes a trivia feature where users answer a set of questions to determine which starter Pokémon best suits them. Based on the answers, a Pokémon is assigned.

3. **Pokémon Photo Capture & Identification**:  
   Using **Gemini**, we integrated a live camera capture feature, where users can take a photo of a Pokémon from their browser's camera. The platform identifies the Pokémon from the captured image and allows users to view information of the captured pokemon.

4. **Real-Time Pokémon Leveling & Evolution**:  
   Once a user has been assigned a starter Pokémon, their Pokémon evolves over time as they spend more time on the site. This creates a dynamic interaction, similar to the progression system in the Pokémon games.

5. **Pokémon Region Map & Locations**:  
   In addition to displaying Pokémon information, the app integrates a Pokémon region map feature. This map showcases the region where a particular Pokémon was first introduced (e.g., Kanto, Johto, Hoenn). It pinpoints the exact locations where the Pokémon can be found in the wild, adding a visual, interactive layer to the data. Users can explore the Pokémon world, seeing key habitats and regions on the map.

6. **Personalized Pokemon Gallery**:
   Users can mark a pokemon as favourite or add comments on pokemons. This adds an element of personalization specific to each user.

## Technologies Used

- **Frontend**: 
  - TypeScript
  - React.js
  - TailwindCSS
- **Backend**: 
  - Node.js with typescript
  - Express with typescript
  - Prisma (ORM)
  - PostgreSQL (Database)
- **APIs & Services**: 
  - [PokéAPI](https://pokeapi.co/): For fetching Pokémon data.
  - **Gemini**: Used to identify Pokémon captured via the browser's live photo feature and enable AI-based interactions with the Pokémon.

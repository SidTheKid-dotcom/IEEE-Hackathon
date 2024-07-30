import React from 'react';

interface Move {
  name: string;
  url: string;
}

interface PokemonMovesProps {
  moves: { move: Move; version_group_details: any[] }[];
}

const PokemonMoves: React.FC<PokemonMovesProps> = ({ moves }) => {
  // Extract the top 4 moves
  const topMoves = moves.slice(0, 4);

  return (
    <div className="pokemon-moves p-4 bg-blue-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Top 4 Moves
      </h2>
      <ul className="list-disc list-inside space-y-2">
        {topMoves.length > 0 ? (
          topMoves.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition ease-in-out duration-300"
            >
              <a href={item.move.url} className="text-blue-600 hover:underline">
                {item.move.name.charAt(0).toUpperCase() + item.move.name.slice(1)}
              </a>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No moves found.</p>
        )}
      </ul>
    </div>
  );
};

export default PokemonMoves;

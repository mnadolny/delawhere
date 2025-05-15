import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import Celebration from './Celebration';

// Using a simplified GeoJSON of US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface Position {
  coordinates: [number, number];
  zoom: number;
}

// Centered more towards the middle of the East Coast, zoomed out to show more states
const INITIAL_POSITION: Position = { coordinates: [-82, 39], zoom: 3 };

const Game: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [clickedStates, setClickedStates] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState<Position>(INITIAL_POSITION);

  const handleStateClick = (geo: any) => {
    if (gameWon) return;
    
    const stateName = geo.properties.name;
    const stateId = geo.id;
    
    setClickedStates(prev => new Set([...prev, stateId]));
    setSelectedState(stateName);
    
    if (stateName === "Delaware") {
      setGameWon(true);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  };

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };

  const handleRestart = () => {
    setSelectedState(null);
    setGameWon(false);
    setClickedStates(new Set());
    setPosition(INITIAL_POSITION);
  };

  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      {showCelebration && <Celebration />}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Find Delaware!</h1>
        {selectedState && (
          <p className="text-lg text-gray-600">
            {gameWon 
              ? "🎉 Congratulations! You found Delaware!" 
              : `You selected: ${selectedState}`}
          </p>
        )}
        {gameWon && (
          <button
            onClick={handleRestart}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md active:transform active:scale-95"
          >
            Play Again
          </button>
        )}
      </div>

      <div className="flex-1 w-full bg-white">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1000
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={12}
            minZoom={2}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isDelaware = geo.properties.name === "Delaware";
                  const isClicked = clickedStates.has(geo.id);
                  const fillColor = isClicked
                    ? (isDelaware ? "#4CAF50" : "#FF5252")
                    : "#DDD";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleStateClick(geo)}
                      style={{
                        default: {
                          fill: fillColor,
                          outline: "none",
                          cursor: gameWon ? "default" : "pointer",
                          stroke: "#000",
                          strokeWidth: 0.25
                        },
                        hover: {
                          fill: isClicked ? fillColor : "#BBB",
                          outline: "none",
                          stroke: "#000",
                          strokeWidth: 0.25
                        },
                        pressed: {
                          fill: fillColor,
                          outline: "none",
                          stroke: "#000",
                          strokeWidth: 0.25
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="text-center py-4 text-gray-600">
        <p>Tap or click on states to find Delaware!</p>
        <p className="text-sm mt-2">
          Tip: You can zoom and pan the map using touch gestures or mouse controls
        </p>
      </div>
    </div>
  );
};

export default Game; 
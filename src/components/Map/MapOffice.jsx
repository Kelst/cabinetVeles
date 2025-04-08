import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MapOffice = ({ coordinates = [48.264296497571564, 25.9371682967154] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCk3eWqtwQDddcKGxI0bQ73gdiCcL5ltag"
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="relative w-full h-[50vh] min-h-[400px] rounded-lg overflow-hidden">
        {isLoaded && (
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={{lat: coordinates[0], lng: coordinates[1]}}
            zoom={15}
          >
            <Marker 
              position={{lat: coordinates[0], lng: coordinates[1]}}
              title="м. Чернівці, вул. Пилипа Орлика 9А"
              visible={true}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default React.memo(MapOffice);
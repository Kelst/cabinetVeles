import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MapOffice = () => {
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
            center={{lat: 48.26659945813064, lng: 25.939732362574233}}
            zoom={13}
          >
            <Marker 
              position={{lat: 48.26924824459138, lng: 25.923757203974443}}
              title="ТЦ Проспект"
              visible={true}
            />
            <Marker 
              position={{lat: 48.25924596720751, lng: 25.95679345477146}}
              title="ТЦ Депот"
              visible={true}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default React.memo(MapOffice);
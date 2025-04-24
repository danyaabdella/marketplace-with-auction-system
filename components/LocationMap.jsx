 'use client';
import { Loader } from "@googlemaps/js-api-loader";
import { createRef, useEffect } from "react";

export default function LocationMap({ location, ...divProps }) {
  const mapsDivRef = createRef();

  useEffect(() => {
    loadMap();
  }, []);

  async function loadMap() {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_KEY ,
    });
    const { Map } = await loader.importLibrary('maps');
    console.log("map ", Map)
    const { AdvancedMarkerElement } = await loader.importLibrary('marker');
    const map = new Map(mapsDivRef.current, {
      mapId: 'map',
      center: { lng: location[0], lat: location[1] },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
    });
    new AdvancedMarkerElement({
      map,
      position: { lng: location[0], lat: location[1] },
    });
  }

  return (
    <div {...divProps} ref={mapsDivRef} className="w-full h-[300px] rounded-lg border"></div>
  );
}
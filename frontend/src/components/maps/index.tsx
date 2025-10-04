"use client";

import { CRS, divIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { renderToString } from "react-dom/server";
import { LayersControl, MapContainer, Marker, Popup, TileLayer, WMSTileLayer, useMapEvents } from "react-leaflet";

const { BaseLayer } = LayersControl;

const Icon = <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative">
        <div className="absolute -inset-4 bg-red-500/30 rounded-full animate-ping"></div>
        <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg relative z-10" fill="currentColor" />
    </div>
</div>

const customIcon = divIcon({
    html: renderToString(Icon),
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

function LocationSelector({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

export default function MapContainerComponent({ lat, lon }: { lat: number, lon: number }) {
    const [position, setPosition] = useState<[number, number]>([lat, lon]);

    const handleSelectLocation = (lat: number, lon: number) => {
        setPosition([lat, lon]);
        console.log("Localidade selecionada:", lat, lon);
    };

    return (
        <MapContainer
            center={[lat, lon]}
            zoom={13}
            style={{ height: "100vh", width: "100%" }}
        >
            <LayersControl position="topright">
                {/* OpenStreetMap */}
                <BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </BaseLayer>

                {/* Google Maps Normal */}
                <BaseLayer name="Google Maps - Normal">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                {/* Google Maps Satélite */}
                <BaseLayer name="Google Maps - Satélite">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                {/* Google Maps Híbrido */}
                <BaseLayer name="Google Maps - Híbrido">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                {/* Google Maps Terreno */}
                <BaseLayer name="Google Maps - Terreno">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                <BaseLayer name="NASA True Color">
                    <WMSTileLayer
                        url="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
                        layers="VIIRS_SNPP_CorrectedReflectance_TrueColor"
                        format="image/jpeg"
                        transparent={false}
                        version="1.3.0"
                        crs={CRS.EPSG4326}
                        time={new Date().toISOString().split("T")[0]}
                    />
                </BaseLayer>
            </LayersControl>
            <LocationSelector onSelect={handleSelectLocation} />

            <Marker position={position} icon={customIcon}>
                <Popup>
                    {`Lat: ${position[0]}, Lon: ${position[1]}`}
                </Popup>
            </Marker>
        </MapContainer>
    );
}

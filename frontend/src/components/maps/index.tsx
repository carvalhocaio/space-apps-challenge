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

export default function MapContainerComponent({ lat, lon, style = { height: "100vh", width: "100%" } }: { lat: number, lon: number, style?: React.CSSProperties }) {
    const [position, setPosition] = useState<[number, number]>([lat, lon]);

    const handleSelectLocation = (lat: number, lon: number) => {
        setPosition([lat, lon]);
        console.log("Localidade selecionada:", lat, lon);
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 8);

    return (
        <MapContainer
            center={[lat, lon]}
            zoom={10}
            style={style}
            className="border-round"
        >
            <BaseLayer name={''}>
                <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1 z-[9999]"
                >
                    <MapPin className="w-3 h-3" />
                    {lat.toFixed(2)}°, {lon.toFixed(2)}°
                </div>
            </BaseLayer>

            <LayersControl position="topright">

                {/* OpenStreetMap */}
                {/* <BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </BaseLayer> */}

                {/* Google Maps Terreno */}
                {/* <BaseLayer name="Google Maps - Terreno">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer> */}
                {/* Visão Natural NASA ontem */}
                <BaseLayer checked name="Visão Natural (NASA)">
                    <WMSTileLayer
                        url={`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?TIME=${yesterday.toISOString().split("T")[0]}`}
                        layers="VIIRS_SNPP_CorrectedReflectance_TrueColor"
                        format="image/jpeg"
                        transparent={true}
                        version="1.3.0"
                        crs={CRS.EPSG4326}
                    />
                </BaseLayer>
                {/* Vegetação/NDVI NASA semana anterior */}
                <BaseLayer name="Vegetação/NDVI (NASA)">
                    <WMSTileLayer
                        url={`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?TIME=${weekAgo.toISOString().split("T")[0]}`}
                        layers="MODIS_Terra_NDVI_8Day"
                        format="image/jpeg"
                        transparent={false}
                        version="1.3.0"
                        crs={CRS.EPSG4326}
                    />
                </BaseLayer>

                {/* Temperatura (NASA) */}
                <BaseLayer name="Temperatura (NASA)">
                    <WMSTileLayer
                        url={`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?TIME=${weekAgo.toISOString().split("T")[0]}`}
                        layers="MODIS_Terra_Land_Surface_Temp_Day"
                        format="image/jpeg"
                        transparent={false}
                        version="1.3.0"
                        crs={CRS.EPSG4326}
                    />
                </BaseLayer>
                                {/* Google Maps Normal */}
                                <BaseLayer name="Normal (Google Maps)">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                {/* Google Maps Satélite */}
                <BaseLayer name="Satélite (Google Maps)">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                </BaseLayer>

                {/* Google Maps Híbrido */}
                <BaseLayer name="Satélite+Normal (Google Maps)">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
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

"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcons = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

export default function Map({ donations, center = [20.5937, 78.9629], zoom = 5 }) {
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {donations.map((donation) => (
                donation.location?.coordinates?.lat && (
                    <Marker
                        key={donation._id}
                        position={[donation.location.coordinates.lat, donation.location.coordinates.lng]}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-green-700">{donation.foodItem}</h3>
                                <p className="text-sm text-gray-600">Qty: {donation.quantity}</p>
                                <p className="text-sm text-gray-600 font-medium">Donor: {donation.donor?.name}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

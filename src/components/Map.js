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

const getIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function Map({ donations, center = [20.5937, 78.9629], zoom = 5 }) {
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {donations.map((donation) => {
                const hasDonorLoc = donation.location?.coordinates?.lat;
                const hasNGOLoc = donation.ngoLocation?.lat; // Hypothetical field for now
                const dist = calculateDistance(
                    donation.location?.coordinates?.lat,
                    donation.location?.coordinates?.lng,
                    donation.ngoLocation?.lat,
                    donation.ngoLocation?.lng
                );

                return (
                    hasDonorLoc && (
                        <Marker
                            key={donation._id}
                            position={[donation.location.coordinates.lat, donation.location.coordinates.lng]}
                            icon={getIcon('green')}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-green-700">{donation.foodItem}</h3>
                                    <p className="text-sm text-gray-600"><strong>From:</strong> {donation.donor?.name || 'Donor'}</p>
                                    <p className="text-sm text-gray-600"><strong>Qty:</strong> {donation.quantity}</p>
                                    {dist && <p className="text-xs font-bold text-blue-600 mt-1">Dist to NGO: {dist} km</p>}
                                </div>
                            </Popup>
                        </Marker>
                    )
                );
            })}
        </MapContainer>
    );
}

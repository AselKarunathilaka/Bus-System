import React, { useState, useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import polyline from "@mapbox/polyline";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

let MapView, Marker, Polyline;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
}

const JourneyMapCard = ({ routeId, schedule, compact = false, showDetails = false }) => {
  const { token } = useContext(AuthContext);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodedPolyline, setDecodedPolyline] = useState([]);

  useEffect(() => {
    const fetchMapData = async () => {
      if (!routeId) {
        setError("Route ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/maps/routes/${routeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.mapStatus !== "ready") {
          setError(response.data.message || "Map preview unavailable");
        } else {
          setMapData(response.data);
          
          if (response.data.routePolyline) {
            const decoded = polyline.decode(response.data.routePolyline).map((point) => ({
              latitude: point[0],
              longitude: point[1]
            }));
            setDecodedPolyline(decoded);
          }
        }
      } catch (err) {
        setError("Failed to load map data");
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [routeId, token]);

  if (loading) {
    return (
      <View className={`bg-white rounded-2xl border border-slate-200 justify-center items-center ${compact ? 'h-40' : 'h-64'}`}>
        <ActivityIndicator size="small" color="#2563EB" />
        <Text className="text-textMuted text-xs mt-2 font-medium">Loading map...</Text>
      </View>
    );
  }

  if (error || !mapData) {
    return (
      <View className="bg-slate-50 rounded-2xl border border-slate-200 p-6 items-center justify-center">
        <Ionicons name="map-outline" size={32} color="#94A3B8" className="mb-2" />
        <Text className="text-textDark font-bold mb-1">Map Preview Unavailable</Text>
        <Text className="text-textMuted text-xs text-center">{error}</Text>
      </View>
    );
  }

  const { startCoordinates, endCoordinates, stops } = mapData;
  
  // Calculate region
  const minLat = Math.min(startCoordinates.lat, endCoordinates.lat, ...stops.filter(s => s.coordinates).map(s => s.coordinates.lat));
  const maxLat = Math.max(startCoordinates.lat, endCoordinates.lat, ...stops.filter(s => s.coordinates).map(s => s.coordinates.lat));
  const minLng = Math.min(startCoordinates.lng, endCoordinates.lng, ...stops.filter(s => s.coordinates).map(s => s.coordinates.lng));
  const maxLng = Math.max(startCoordinates.lng, endCoordinates.lng, ...stops.filter(s => s.coordinates).map(s => s.coordinates.lng));

  const initialRegion = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.05),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.05),
  };

  const distanceKm = (mapData.routeDistanceMeters / 1000).toFixed(1);
  const durationMinutes = Math.round(mapData.routeDurationSeconds / 60);
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const getLeafletHtml = () => {
    const coords = decodedPolyline.map(p => [p.latitude, p.longitude]);
    const start = startCoordinates ? [startCoordinates.lat, startCoordinates.lng] : null;
    const end = endCoordinates ? [endCoordinates.lat, endCoordinates.lng] : null;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; }
          #map { height: 100vh; width: 100vw; }
          .custom-div-icon { background: none; border: none; }
          .marker-start { background-color: #ffffff; border: 3px solid #2563EB; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .marker-end { background-color: #10B981; border: 3px solid #ffffff; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .marker-stop { background-color: #ffffff; border: 4px solid #94A3B8; border-radius: 50%; width: 10px; height: 10px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false, attributionControl: false });
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          const coords = ${JSON.stringify(coords)};
          if (coords && coords.length > 0) {
            const polyline = L.polyline(coords, { color: '#3B82F6', weight: 5, opacity: 0.9 }).addTo(map);
            map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
          } else if (${JSON.stringify(start)}) {
            map.setView(${JSON.stringify(start)}, 13);
          }

          const createIcon = (className) => L.divIcon({ className: 'custom-div-icon', html: '<div class="' + className + '"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });

          const startCoord = ${JSON.stringify(start)};
          if (startCoord) L.marker(startCoord, { icon: createIcon('marker-start') }).addTo(map);
          
          const endCoord = ${JSON.stringify(end)};
          if (endCoord) L.marker(endCoord, { icon: createIcon('marker-end') }).addTo(map);

          const stops = ${JSON.stringify(stops.filter(s => s.coordinates).map(s => [s.coordinates.lat, s.coordinates.lng]))};
          stops.forEach(stop => {
            L.marker(stop, { icon: createIcon('marker-stop') }).addTo(map);
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View className="bg-white rounded-3xl overflow-hidden border border-slate-200">
      <View className="p-4 border-b border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-blue-50 p-1.5 rounded-lg mr-3">
            <Ionicons name="map" size={16} color="#2563EB" />
          </View>
          <Text className="font-bold text-textDark text-sm">Journey Overview</Text>
        </View>
        {showDetails && (
          <Text className="text-xs font-bold text-primary">{distanceKm} km • {durationText}</Text>
        )}
      </View>

      {Platform.OS === 'web' ? (
        <View className={`w-full overflow-hidden ${compact ? "h-48" : "h-72"}`}>
          <iframe 
            srcDoc={getLeafletHtml()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="Route Map"
          />
        </View>
      ) : (
        <View className={compact ? "h-48" : "h-72"}>
          <MapView
            style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation={false}
          scrollEnabled={!compact}
          zoomEnabled={!compact}
        >
          {decodedPolyline.length > 0 && (
            <Polyline
              coordinates={decodedPolyline}
              strokeColor="#3B82F6"
              strokeWidth={4}
            />
          )}

          {/* Start Marker */}
          {startCoordinates && (
            <Marker
              coordinate={{ latitude: startCoordinates.lat, longitude: startCoordinates.lng }}
              title={mapData.startLocation}
              description="Departure"
            >
              <View className="bg-white p-1 rounded-full border-2 border-primary shadow-sm">
                <Ionicons name="bus" size={16} color="#2563EB" />
              </View>
            </Marker>
          )}

          {/* Stop Markers */}
          {stops.map((stop) => (
            stop.coordinates && stop.coordinates.lat && stop.coordinates.lng ? (
              <Marker
                key={stop._id}
                coordinate={{ latitude: stop.coordinates.lat, longitude: stop.coordinates.lng }}
                title={stop.stopName}
                description={stop.location}
              >
                <View className="w-3 h-3 bg-white rounded-full border-[3px] border-slate-400" />
              </Marker>
            ) : null
          ))}

          {/* End Marker */}
          {endCoordinates && (
            <Marker
              coordinate={{ latitude: endCoordinates.lat, longitude: endCoordinates.lng }}
              title={mapData.endLocation}
              description="Arrival"
            >
              <View className="bg-emerald-500 p-1 rounded-full border-2 border-white shadow-sm">
                <Ionicons name="flag" size={16} color="#ffffff" />
              </View>
            </Marker>
          )}
        </MapView>
      </View>
      )}

      {!compact && showDetails && (
        <View className="p-4 bg-slate-50 flex-row justify-between">
          <View>
            <Text className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Route</Text>
            <Text className="text-sm font-bold text-textDark">{mapData.startLocation} → {mapData.endLocation}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Stops</Text>
            <Text className="text-sm font-bold text-textDark">{stops.length} Stops</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default JourneyMapCard;

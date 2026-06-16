import React, { useState, useEffect, useContext } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";

// Use same dynamic import approach for MapView as other components
let MapView, Marker, Polyline;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
}

// Helper to generate distinct vibrant colors for routes
const getRouteColor = (index) => {
  const colors = [
    '#2563EB', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  return colors[index % colors.length];
};

const AdminNetworkMapScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodedRoutes, setDecodedRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await api.get("/routes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const activeRoutes = response.data.filter(r => r.status === 'active' && r.routePolyline && r.startCoordinates);
        setRoutes(activeRoutes);
        
        if (Platform.OS !== 'web') {
          // Decode polylines for native MapView
          const polyline = require("@mapbox/polyline");
          const decoded = activeRoutes.map(r => ({
            ...r,
            coordinates: polyline.decode(r.routePolyline).map(point => ({
              latitude: point[0],
              longitude: point[1]
            }))
          }));
          setDecodedRoutes(decoded);
        }
      } catch (err) {
        setError("Failed to load network routes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, [token]);

  const getLeafletHtml = () => {
    // Generate JavaScript array of routes for Leaflet
    const routesData = routes.map((r, index) => {
      // For web, Leaflet expects encoded polylines to be decoded by a plugin,
      // but we can just use our own simple decoder or mapbox/polyline directly in the browser.
      return {
        id: r._id,
        name: r.routeName,
        startName: r.startLocation,
        endName: r.endLocation,
        color: getRouteColor(index),
        polyline: r.routePolyline,
        startCoords: r.startCoordinates ? [r.startCoordinates.lat, r.startCoordinates.lng] : null,
        endCoords: r.endCoordinates ? [r.endCoordinates.lat, r.endCoordinates.lng] : null,
        details: `${(r.routeDistanceMeters / 1000).toFixed(1)} km • ${r.price} LKR`
      };
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <!-- Polyline decoder -->
        <script src="https://unpkg.com/@mapbox/polyline@1.2.0/src/polyline.js"></script>
        <style>
          body { padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          #map { height: 100vh; width: 100vw; }
          .custom-div-icon { background: none; border: none; }
          .hub-marker { background-color: #ffffff; border: 3px solid #1E293B; border-radius: 50%; width: 14px; height: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: true, attributionControl: false });
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          const routesData = ${JSON.stringify(routesData)};
          const allBounds = [];

          routesData.forEach(route => {
            if (route.polyline) {
              const decodedCoords = polyline.decode(route.polyline);
              if (decodedCoords && decodedCoords.length > 0) {
                const line = L.polyline(decodedCoords, { 
                  color: route.color, 
                  weight: 4, 
                  opacity: 0.8 
                }).addTo(map);
                
                line.bindPopup('<b>' + route.name + '</b><br>' + route.startName + ' &rarr; ' + route.endName + '<br>' + route.details);
                
                allBounds.push(...decodedCoords);
              }
            }
            
            const createIcon = (className) => L.divIcon({ className: 'custom-div-icon', html: '<div class="' + className + '"></div>', iconSize: [20, 20], iconAnchor: [10, 10] });

            if (route.startCoords) {
              L.marker(route.startCoords, { icon: createIcon('hub-marker') })
                .bindTooltip(route.startName, { direction: 'top', offset: [0, -10] })
                .addTo(map);
            }
            if (route.endCoords) {
              L.marker(route.endCoords, { icon: createIcon('hub-marker') })
                .bindTooltip(route.endName, { direction: 'top', offset: [0, -10] })
                .addTo(map);
            }
          });

          if (allBounds.length > 0) {
            map.fitBounds(L.latLngBounds(allBounds), { padding: [30, 30] });
          } else {
            // Default Sri Lanka center
            map.setView([7.8731, 80.7718], 7);
          }
        </script>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <AppLayout useSafeArea>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-4 text-slate-500">Loading network map...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout useSafeArea>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-slate-200 flex-row items-center justify-between z-10 shadow-sm">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-extrabold text-slate-800">Network Map</Text>
              <Text className="text-xs font-medium text-slate-500">{routes.length} Active Routes</Text>
            </View>
          </View>
        </View>

        {/* Map Container */}
        <View className="flex-1 bg-slate-100">
          {error ? (
            <View className="flex-1 items-center justify-center p-6">
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" className="mb-4" />
              <Text className="text-slate-800 font-bold text-lg mb-2">Map Error</Text>
              <Text className="text-slate-500 text-center">{error}</Text>
            </View>
          ) : Platform.OS === 'web' ? (
            <iframe 
              srcDoc={getLeafletHtml()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Network Analytics Map"
            />
          ) : (
            <MapView
              style={StyleSheet.absoluteFillObject}
              showsUserLocation={false}
              initialRegion={{
                latitude: 7.8731,
                longitude: 80.7718,
                latitudeDelta: 3.5,
                longitudeDelta: 3.5,
              }}
            >
              {decodedRoutes.map((route, index) => (
                <React.Fragment key={route._id}>
                  {route.coordinates && route.coordinates.length > 0 && (
                    <Polyline
                      coordinates={route.coordinates}
                      strokeColor={getRouteColor(index)}
                      strokeWidth={3}
                    />
                  )}
                  {route.startCoordinates && (
                    <Marker
                      coordinate={{ latitude: route.startCoordinates.lat, longitude: route.startCoordinates.lng }}
                      title={route.startLocation}
                    >
                      <View className="w-3 h-3 bg-white rounded-full border-[3px] border-slate-800" />
                    </Marker>
                  )}
                  {route.endCoordinates && (
                    <Marker
                      coordinate={{ latitude: route.endCoordinates.lat, longitude: route.endCoordinates.lng }}
                      title={route.endLocation}
                    >
                      <View className="w-3 h-3 bg-white rounded-full border-[3px] border-slate-800" />
                    </Marker>
                  )}
                </React.Fragment>
              ))}
            </MapView>
          )}
        </View>
      </View>
    </AppLayout>
  );
};

export default AdminNetworkMapScreen;

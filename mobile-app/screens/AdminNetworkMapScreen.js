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
          .hub-marker { background-color: #ffffff; border: 3px solid #1E293B; border-radius: 50%; width: 12px; height: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: all 0.3s ease; }
          .hub-marker-active { transform: scale(1.5); border-width: 4px; z-index: 1000 !important; }
          .route-distance-label { background: rgba(255,255,255,0.95); border: none; padding: 4px 8px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #1E293B; box-shadow: 0 4px 6px rgba(0,0,0,0.1); white-space: nowrap; backdrop-filter: blur(4px); }
          .dummy-icon { display: none; }
          
          /* Legend Styles */
          .legend { background: rgba(255,255,255,0.95); padding: 16px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid rgba(226,232,240,0.8); max-height: 85vh; overflow-y: auto; backdrop-filter: blur(10px); min-width: 220px; }
          .legend h4 { margin: 0 0 12px 0; color: #0F172A; font-family: sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.5px; }
          .legend-item { display: flex; align-items: center; padding: 8px; margin-bottom: 4px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; }
          .legend-item:hover { background: #F8FAFC; border-color: #E2E8F0; transform: translateX(-4px); }
          .legend-color { width: 12px; height: 12px; border-radius: 50%; margin-right: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .legend-text { display: flex; flex-direction: column; }
          .legend-name { font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 2px; }
          .legend-dist { font-size: 11px; color: #64748B; font-weight: 500; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: true, attributionControl: false });
          // Using Google Maps vivid standard layout
          L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps'
          }).addTo(map);

          const routesData = ${JSON.stringify(routesData)};
          const allBounds = [];
          const mapLayers = {}; // Store layers to control them easily

          // 1. Draw all lines
          routesData.forEach((route) => {
            if (route.polyline) {
              const decodedCoords = polyline.decode(route.polyline);
              if (decodedCoords && decodedCoords.length > 0) {
                // Base state: thinner, semi-transparent, elegant
                const line = L.polyline(decodedCoords, { 
                  color: route.color, 
                  weight: 4, 
                  opacity: 0.5,
                  lineCap: 'round',
                  lineJoin: 'round'
                }).addTo(map);
                
                const centerIdx = Math.floor(decodedCoords.length / 2);
                const distanceText = route.details.split(' • ')[0];
                
                // Tooltip marker (hidden by default)
                const tooltipMarker = L.marker(decodedCoords[centerIdx], { icon: L.divIcon({ className: 'dummy-icon' }) })
                  .bindTooltip('<span style="color:' + route.color + '">●</span> ' + distanceText, { permanent: true, direction: 'center', className: 'route-distance-label' });

                mapLayers[route.id] = { line, tooltipMarker, decodedCoords };
                allBounds.push(...decodedCoords);
                
                // Interaction on the line itself
                line.on('mouseover', () => highlightRoute(route.id));
                line.on('mouseout', () => resetHighlight());
                line.on('click', () => {
                  map.flyToBounds(line.getBounds(), { padding: [50, 50], duration: 0.8 });
                });
              }
            }
          });

          // Draw hubs
          const createIcon = (className) => L.divIcon({ className: 'custom-div-icon', html: '<div class="' + className + '"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
          routesData.forEach((route) => {
             if (route.startCoords) L.marker(route.startCoords, { icon: createIcon('hub-marker'), interactive: false }).addTo(map);
             if (route.endCoords) L.marker(route.endCoords, { icon: createIcon('hub-marker'), interactive: false }).addTo(map);
          });

          // Highlight function
          function highlightRoute(activeId) {
            Object.keys(mapLayers).forEach(id => {
              const layer = mapLayers[id];
              if (id === activeId) {
                layer.line.setStyle({ weight: 8, opacity: 1 });
                layer.line.bringToFront();
                layer.tooltipMarker.addTo(map);
              } else {
                layer.line.setStyle({ weight: 3, opacity: 0.15 });
              }
            });
          }

          function resetHighlight() {
            Object.keys(mapLayers).forEach(id => {
              const layer = mapLayers[id];
              layer.line.setStyle({ weight: 4, opacity: 0.5 });
              map.removeLayer(layer.tooltipMarker);
            });
          }

          // Add interactive legend
          const legend = L.control({ position: 'topright' });
          legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'legend');
            let html = '<h4>Network Routes</h4>';
            
            routesData.forEach(route => {
              html += \`
                <div class="legend-item" onmouseenter="highlightRoute('\${route.id}')" onmouseleave="resetHighlight()" onclick="zoomToRoute('\${route.id}')">
                  <div class="legend-color" style="background-color: \${route.color}; border: 2px solid #fff;"></div>
                  <div class="legend-text">
                    <span class="legend-name">\${route.name}</span>
                    <span class="legend-dist">\${route.details}</span>
                  </div>
                </div>
              \`;
            });
            div.innerHTML = html;
            return div;
          };
          legend.addTo(map);

          window.zoomToRoute = function(id) {
            const layer = mapLayers[id];
            if (layer) {
               map.flyToBounds(layer.line.getBounds(), { padding: [40, 40], duration: 0.6 });
            }
          };

          if (allBounds.length > 0) {
            map.fitBounds(L.latLngBounds(allBounds), { padding: [40, 40] });
          } else {
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
                      title={`Start: ${route.startLocation}`}
                    >
                      <View className="w-3 h-3 bg-white rounded-full border-[3px] border-slate-800" />
                    </Marker>
                  )}
                  {route.endCoordinates && (
                    <Marker
                      coordinate={{ latitude: route.endCoordinates.lat, longitude: route.endCoordinates.lng }}
                      title={`End: ${route.endLocation}`}
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

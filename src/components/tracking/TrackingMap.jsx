import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Vite
/** @type {any} */
const defaultIconProto = L.Icon.Default.prototype;
delete defaultIconProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const goldIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#f59e0b;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  iconAnchor: [7, 7],
});

const grayIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#6b7280;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconAnchor: [6, 6],
});

const destIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#f59e0b;border:4px solid #fff;box-shadow:0 0 0 3px rgba(245,158,11,0.4),0 4px 12px rgba(0,0,0,0.4)"></div>`,
  iconAnchor: [9, 9],
});

/**
 * @param {{ positions: [number, number][] }} props
 */
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

/**
 * @typedef {Object} JourneyPoint
 * @property {string} name
 * @property {number} lat
 * @property {number} lng
 * @property {boolean} done
 */

/**
 * @param {{ journey: JourneyPoint[], destination: { name: string, lat: number, lng: number } }} props
 */
export default function TrackingMap({ journey, destination }) {
  /** @type {[number, number][]} */
  const positions = journey.map((p) => [p.lat, p.lng]);
  /** @type {[number, number][]} */
  const donePositions = journey.filter((p) => p.done).map((p) => [p.lat, p.lng]);

  // Find the "current" position (last done point)
  const currentPoint = [...journey].reverse().find((p) => p.done);

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 h-72 sm:h-80">
      <MapContainer
        center={[23.8859, 45.0792]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <FitBounds positions={positions} />

        {/* Completed route */}
        {donePositions.length > 1 && (
          <Polyline
            positions={donePositions}
            pathOptions={{ color: "#f59e0b", weight: 3, opacity: 0.9, dashArray: undefined }}
          />
        )}

        {/* Remaining route */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: "#6b7280", weight: 2, opacity: 0.4, dashArray: "6 6" }}
          />
        )}

        {/* Journey waypoints */}
        {journey.map((point, i) => {
          const isLast = i === journey.length - 1;
          const isCurrent = currentPoint?.name === point.name && point.done;
          const icon = isLast ? destIcon : isCurrent ? goldIcon : point.done ? goldIcon : grayIcon;
          return (
            <Marker key={i} position={[point.lat, point.lng]} icon={icon}>
              <Popup>
                <span style={{ color: "#111", fontSize: 12, fontWeight: 600 }}>{point.name}</span>
                <br />
                <span style={{ color: "#888", fontSize: 11 }}>
                  {point.done ? (isLast ? "Destination" : "Passed") : "Upcoming"}
                </span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapApp = () => {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [markerData, setMarkerData] = useState([
    {
      position: [51.5074, -0.1278],
      data: {
        title: "Big Ben",
        description: "Famous clock tower in London",
        time: "Always",
        address: "Westminster, London SW1A 0AA, UK",
      },
    },
  ]);
  const mapRef = useRef(null);
  const [newMarkerData, setNewMarkerData] = useState({
    title: "",
    description: "",
    time: "",
    address: "",
    lat: "",
    lng: "",
  });
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");

  const AddMarkerButton = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const addressData = await getAddressFromCoordinates(lat, lng);
        setMarkerPosition((prevMarkers) => [...prevMarkers, [lat, lng]]);
        setMarkerData((prevData) => [
          ...prevData,
          {
            position: [lat, lng],
            data: {
              title: "",
              description: "",
              time: "",
              address: addressData.display_name,
            },
          },
        ]);
        setNewMarkerData({
          title: "",
          description: "",
          time: "",
          address: addressData.display_name,
          lat: lat,
          lng: lng,
        });
        setIsAddingMarker(true);
      },
    });

    return (
      <div>
        <button onClick={() => map.locate({ setView: true })}>
          Add Marker
        </button>
      </div>
    );
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      console.log(response.data)
      return response.data;

    } catch (error) {
      console.error("Error getting address:", error);
      return "Unknown address";
    }
  };

  const getCoordinatesFromAddress = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchAddress}&format=json&limit=1`
      );
      
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setNewMarkerData({
          ...newMarkerData,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          address: response.data[0].display_name,
        });
        setIsAddingMarker(true);
        mapRef.current.flyTo([parseFloat(lat), parseFloat(lon)], 13);
      } else {
        console.error("No results found for the address");
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newMarkerInfo = {
      position: [newMarkerData.lat, newMarkerData.lng],
      data: newMarkerData,
    };
    setMarkerData((prevData) => [...prevData, newMarkerInfo]);
    console.log("New Marker Data:", newMarkerInfo);
    setNewMarkerData({
      title: "",
      description: "",
      time: "",
      address: "",
      lat: "",
      lng: "",

    });
    setIsAddingMarker(false);
    setSearchAddress("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMarkerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchAddressChange = (e) => {
    setSearchAddress(e.target.value);
  };

  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={[51.505, -0.09]}
        zoom={13}
        style={{ width: "60%", height: "50vh", margin: "10vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <AddMarkerButton />

        {markerData.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            draggable={false}
            icon={L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            })}
          >
            <Popup>
              <div>
                <p>Time: {marker.data.time}</p>
                <p>Address: {marker.data.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {isAddingMarker && (
          <Marker
            position={[newMarkerData.lat, newMarkerData.lng]}
            draggable={false}
            icon={L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            })}
          >
            <Popup>
              <div>
                <p>Time: {newMarkerData.time}</p>
                <p>Address: {newMarkerData.address}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search for an address"
          value={searchAddress}
          onChange={handleSearchAddressChange}
        />
        <button onClick={getCoordinatesFromAddress}>Add Marker</button>
      </div>

      {isAddingMarker && (
        <div style={{ marginTop: "20px" }}>
          <h2>Add New Marker</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newMarkerData.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newMarkerData.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="text"
              name="time"
              placeholder="Time"
              value={newMarkerData.time}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newMarkerData.address}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Add Marker</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MapApp;
"use client";

import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";


// const L = dynamic(
//   () => import("leaflet").then((module) => module.L),
//   {
//     ssr: false,
//   }
// );
// const useMap = dynamic(
//   () => import("react-leaflet").then((module) => module.useMap),
//   {
//     ssr: false,
//   }
// );

// const MapContainer = dynamic(
//   () => import("react-leaflet").then((module) => module.MapContainer),
//   {
//     ssr: false, // Disable server-side rendering for this component
//   }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((module) => module.TileLayer),
//   {
//     ssr: false,
//   }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((module) => module.Marker),
//   {
//     ssr: false,
//   }
// );
// const Popup = dynamic(
//   () => import("react-leaflet").then((module) => module.Popup),
//   {
//     ssr: false,
//   }
// );

// const useMapEvents = dynamic(
//   () => import("react-leaflet").then((module) => module.useMapEvents),
//   {
//     ssr: false,
//   }
// );

const MapApp = () => {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [markerData, setMarkerData] = useState([
    {
      title: "",
      description: "",
      time: "",
      address: "",
    },
  ]);
  const [searchAddress, setSearchAddress] = useState("");
  const mapRef = useRef(null);

  const AddMarkerButton = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const addressData = await getAddressFromCoordinates(lat, lng);
        setMarkerPosition((prevMarkers) => [...prevMarkers, [lat, lng]]);
        setMarkerData((prevData) => [
          ...prevData,
          { title: "", description: "", time: "", address: addressData },
        ]);
        console.log(
          "New Marker Position:",
          [lat, lng],
          "Address:",
          addressData
        );
      },
    });

    return (
      <button onClick={() => map.locate({ setView: true })}>Add Marker</button>
    );
  };

  const handleSubmit = (index) => {
    const combinedMarker = {
      position: markerPosition[index],
      data: markerData[index],
    };
    console.log("Combined Marker:", combinedMarker);
  };

  const handleInputChange = (e, index) => {
    setMarkerData((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, [e.target.name]: e.target.value } : data
      )
    );
  };

  const handleSearchAddress = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchAddress}&format=json&limit=1`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const addressData = await getAddressFromCoordinates(lat, lon);
        setMarkerPosition((prevMarkers) => [...prevMarkers, [lat, lon]]);
        setMarkerData((prevData) => [
          ...prevData,
          { title: "", description: "", time: "", address: addressData },
        ]);
        console.log(
          "New Marker Position:",
          [lat, lon],
          "Address:",
          addressData
        );
        const map = mapRef.current;
        if (map) {
          map.flyTo([lat, lon], 13, {
            duration: 2,
            easeLinearity: 0.5,
          });
        }
      } else {
        console.log("No address found");
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      console.log(response)
      let address = ''
      address += response.data.display_name;
      return address;
    } catch (error) {
      console.error("Error getting address:", error);
      return "Unknown address";
    }
  };

  return (
    <div>
      <div style={{ margin: "20vh" }}>
        <input
          type="text"
          placeholder="Search Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          style={{ marginRight: "10px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchAddress();
            }
          }}
        />
        <button onClick={handleSearchAddress}>Find Address</button>
      </div>
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

        {markerPosition.map((position, index) => (
          <Marker
            key={index}
            position={position}
            draggable={false}
            icon={L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            })}
          >
            <Popup>
              <div>
                <p>Address: {markerData[index+1].address}</p>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={markerData[index].title}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={markerData[index].description}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <input
                  type="text"
                  name="time"
                  placeholder="Time"
                  value={markerData[index].time}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <button onClick={() => handleSubmit(index)}>Submit</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapApp;

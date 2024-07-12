"use client";

import React, { useState, useRef, useEffect } from "react";
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
import styles from "./styles/Card.module.css";
import OpacitedButton from "./ui/opacitedButton";
import PurpleButton from "./ui/purpleButton";
import DefaultInput from "./ui/defaultInput";
import { fetchWithAuth } from "../utils/api";
import classesStyles from "./styles/Schedule.module.css";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const MapApp = () => {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [markerData, setMarkerData] = useState([]);

  useEffect(() => {
    const addEvents = async () => {
      try {
        const url = `https://bizkit.fun/api/v1/event/all`;
        const response = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (Array.isArray(data.body)) {
          setMarkerData(data.body);
        }
      } catch (error) {
        console.error(error);
      }
    };
    addEvents();
  }, []);

  const mapRef = useRef(null);
  const [newMarkerData, setNewMarkerData] = useState({
    title: "",
    description: "",
    time: null,
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
      return response.data;
    } catch (error) {
      Toastify({
        text: 'Произошла ошибка',
        duration: 3000,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#7950F2",
          width: '100%'
        },
        onClick: function() {}
      }).showToast();
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
        Toastify({
          text: 'Данные отправлены, ожидайте',
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#7950F2",
            width: '100%'
          },
          onClick: function() {}
        }).showToast();
      } else {
        console.error("No results found for the address");
        Toastify({
          text: 'Ошибка, попробуйте позже',
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#7950F2",
            width: '100%'
          },
          onClick: function() {}
        }).showToast();
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newMarkerInfo = {
      position: [newMarkerData.lat, newMarkerData.lng],
      data: newMarkerData,
    };
    setMarkerData((prevData) => [...prevData, newMarkerInfo]);
    setNewMarkerData({
      title: "",
      description: "",
      time: "",
      address: "",
      lat: "",
      lng: "",
    });
    try {
      const response = await fetchWithAuth(
        "https://bizkit.fun/api/v1/event/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMarkerData),
        }
      );
    

      const responseData = await response.json();
     
      Toastify({
        text: 'Данные успешно добавлены',
        duration: 3000,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#7950F2",
          width: '100%'
        },
        onClick: function() {}
      }).showToast();
    } catch (error) {
      console.error("Error:", error);
      Toastify({
        text: 'Ошибка, проверьте корректность данных',
        duration: 3000,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#7950F2",
          width: '100%'
        },
        onClick: function() {}
      }).showToast();
    }
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

  function convertTime(timeString) {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const convertedTime = `${year}-${month}-${day} ${hour}:${minute}`;
    return convertedTime;
  }

  return (
    <>
    
      <div className={styles.map}>
        <MapContainer
          ref={mapRef}
          center={[	55.7522, 37.6156]}
          zoom={13}
          style={{ width: "100%", height: "500px", borderRadius: "16px" }}
          className={styles.map_container}
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
                  <p>Название; {marker?.data?.title}</p>
                  <p>Описание: {marker?.data?.description}</p>
                  <p>Начало: {convertTime(marker?.data?.start_time)}</p>
                  <p>Адрес: {marker?.data?.address}</p>
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
                  <p>Название; {newMarkerData?.data?.title}</p>
                  <p>Описание: {newMarkerData?.data?.description}</p>
                  <p>Начало: {convertTime(newMarkerData?.data?.start_time)}</p>
                  <p>Адрес: {newMarkerData?.data?.address}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <div
          className={styles.map_find_box}
          style={{
            margin: "auto",
            marginTop: "20px",
            width: "100%",
            display: "flex",
            height: "50px",
          }}
        >
          <DefaultInput
            type={"text"}
            title={"Адресс"}
            value={searchAddress}
            onChange={handleSearchAddressChange}
          ></DefaultInput>

          {/* <input
            type="text"
            placeholder="Search for an address"
            value={searchAddress}
            onChange={handleSearchAddressChange}
          /> */}

          <div style={{ marginTop: "45px", marginLeft: "15px" }}>
            <OpacitedButton
              title={"Добавить"}
              onClick={getCoordinatesFromAddress}
            ></OpacitedButton>
          </div>
        </div>

        {isAddingMarker && (
          <div
            className={classesStyles.classes_create_class_box}
            style={{ marginTop: "100px" }}
          >
            <form onSubmit={handleFormSubmit}>
              <DefaultInput
                type={"text"}
                title={"Название"}
                name={"title"}
                value={newMarkerData.title}
                onChange={handleInputChange}
              ></DefaultInput>
              {/* <input
                type="text"
                name="title"
                placeholder="Title"
                value={newMarkerData.title}
                onChange={handleInputChange}
                required
              /> */}
              <DefaultInput
                type={"text"}
                value={newMarkerData.description}
                title={"Описание"}
                name={"description"}
                onChange={handleInputChange}
              ></DefaultInput>
              {/* <textarea
                name="description"
                placeholder="Description"
                value={newMarkerData.description}
                onChange={handleInputChange}
                required
              ></textarea> */}
              {/* <DefaultInput type={"text"} value={newMarkerData.time} title={"Время"} name={"time"}  onChange={handleInputChange}></DefaultInput> */}

              {/* <input
                type="text"
                name="time"
                placeholder="Time"
                value={newMarkerData.time}
                onChange={handleInputChange}
                required
              /> */}
              <DefaultInput
                type={"text"}
                value={newMarkerData.address}
                title={"Адресс"}
                name={"address"}
                onChange={handleInputChange}
              ></DefaultInput>

              <input
                className={classesStyles.classes_create_date}
                style={{ marginLeft: "40px" }}
                name="time"
                type="datetime-local"
                value={newMarkerData.time}
                onChange={handleInputChange}
                required
              />
              {/* <input
                type="text"
                name="address"
                placeholder="Address"
                value={newMarkerData.address}
                onChange={handleInputChange}
                required
              /> */}
              <div
                style={{ float: "left", marginLeft: "40px", marginTop: "20px" }}
              >
                <PurpleButton type={"submit"} title={"Создать"}></PurpleButton>
              </div>
              {/* <button type="submit">Add Marker</button> */}
            </form>
          </div>
        )}
        
      </div>
    <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      
      

      
    </>
  );
};

export default MapApp;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";

const crab = require("./assets/crab.png");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [selectedItem, setSelectedItem] = useState(1);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        setPermissionsGranted(finalStatus === "granted");
      } else {
        console.log("Must use a physical device for Push Notifications");
      }
    };

    requestPermissions();
  }, []);

  /*   useEffect(() => {
    const cancelScheduledNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All scheduled notifications have been canceled.");
    };

    cancelScheduledNotifications();
  }, []); ESTO ES PARA CANCELAR LAS NOTIFICACIONES EN CASO DE USAR TIME_INTERVAL*/

  const addToCart = async () => {
    if (!permissionsGranted) {
      console.log("Notifications not granted. Please enable them in settings");
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Cart Reminder",
        body: `${selectedItem} item(s) have in your cart. Please proceed to checkout`,
        sound: "default",
      },
      trigger: new Date(Date.now() + 30 * 1000),
      /*{ type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2, 
      }*/
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <Text>Cart Notification App</Text>
      <Text>Select Number of items:</Text> */}
      {/* <Picker
        selectedValue={selectedItem}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedItem(itemValue)}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i} value={i + 1} label={`${i + 1}`} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={addToCart}>
        <Text style={styles.buttonText}>Add item to cart</Text>
      </TouchableOpacity> */}

      <Image source={crab} style={styles.pet} />

      <View style={styles.petVital} />

      <View style={styles.grid}>
        <Pressable style={styles.pressable}>
          <Text style={styles.text}>Alimentar</Text>
        </Pressable>
        <Pressable style={styles.pressable}>
          <Text style={styles.text}>Jugar</Text>
        </Pressable>
        <Pressable style={styles.pressable}>
          <Text style={styles.text}>Bañar</Text>
        </Pressable>
        <Pressable style={styles.pressable}>
          <Text style={styles.text}>Dormir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    backgroundColor: "#f8f8f8", // Color de fondo opcional
    paddingTop: 30,
  },
  grid: {
    width: "80%", // Ajusta según tus necesidades
    aspectRatio: 1, // Mantiene el contenedor cuadrado
    flexDirection: "row", // Distribuye elementos en filas
    flexWrap: "wrap", // Permite que los elementos pasen a la siguiente fila
    justifyContent: "space-between", // Espaciado horizontal uniforme
    alignContent: "space-between", // Espaciado vertical uniforme
    gap: 6,
  },
  pressable: {
    width: "48%", // Ajusta el tamaño de cada Pressable
    aspectRatio: 1, // Mantiene los Pressable cuadrados
    backgroundColor: "#4caf50", // Color de fondo de los botones
    justifyContent: "center", // Centra el contenido del Pressable
    alignItems: "center", // Centra el contenido del Pressable
    borderRadius: 10, // Bordes redondeados
  },
  text: {
    color: "white", // Color del texto
    fontSize: 18, // Tamaño de la fuente
    fontWeight: "bold", // Texto en negrita
  },
  pet: {
    width: 320,
    height: 320,
    marginTop: 29,
  },
  petVital: {
    width: 320,
    height: 50,
    backgroundColor: "#4caf50",
    borderRadius: 20,
    marginVertical: 12,
  },
});

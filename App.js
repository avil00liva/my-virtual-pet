import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Solicitar permisos de notificaciones
  const requestPermissions = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Debes habilitar las notificaciones para recibir recordatorios.");
      }
    } else {
      alert("Las notificaciones no funcionan en un simulador/emulador.");
    }
  };

  const scheduleNotificationEvery2Hours = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Tu mascota tiene hambre! 🐾",
        body: "Recuerda alimentarla para que siga feliz.",
      },
      trigger: { seconds: 120, repeats: true }, // Cada 2 horas
    });
  };

  useEffect(() => {
    const setup = async () => {
      await requestPermissions();
      await scheduleNotificationEvery2Hours();
    };
    setup();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tu mascota virtual</Text>
      <Button
        title="Programar notificaciones recurrentes"
        onPress={scheduleNotificationEvery2Hours}
      />
      <View style={{ marginTop: 29 }}>
        <Button
          title="Cancelar todas las notificaciones"
          onPress={async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
            Alert.alert("Notificaciones canceladas");
          }}
        />
      </View>
    </View>
  );
}

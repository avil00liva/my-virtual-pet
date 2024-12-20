import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

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

  useEffect(() => {
    const cancelScheduledNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All scheduled notifications have been canceled.");
    };

    cancelScheduledNotifications();
  }, []);

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Cart Notification App</Text>
      <Text>Select Number of items:</Text>
      <Picker
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
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 200,
    height: 50,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

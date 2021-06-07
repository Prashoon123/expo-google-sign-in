import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import * as Google from "expo-google-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storeCredentials, setStoreCredentials] = useState(null);

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("credentials")
      .then((result) => {
        if (result !== null) {
          setStoreCredentials(JSON.parse(result));
        } else {
          setStoreCredentials(null);
        }
      })
      .catch((err) => console.log(err));
  };

  const persistLogin = (credentials) => {
    AsyncStorage.setItem("credentials", JSON.stringify(credentials))
      .then(() => {
        setStoreCredentials(credentials);
      })
      .catch((err) => console.log(err));
  };

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }

  const handleGoogleSignIn = () => {
    const config = {
      iosClientId:
        "977031174034-el6lp58go1f8e6vq217tbkspadvjuqp7.apps.googleusercontent.com",
      androidClientId:
        "977031174034-dv2qribf7h37bq9n2pvdjf19ecngidcr.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    };

    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;

        if (type === "success") {
          persistLogin(user);
        }
      })
      .catch((err) => alert(err.message));
  };

  const handleGoogleSignOut = () => {
    Google.logOutAsync({
      accessToken: storeCredentials.id,
      iosClientId:
        "977031174034-el6lp58go1f8e6vq217tbkspadvjuqp7.apps.googleusercontent.com",
      androidClientId:
        "977031174034-dv2qribf7h37bq9n2pvdjf19ecngidcr.apps.googleusercontent.com",
      androidStandaloneAppClientId:
        "977031174034-ei8vq6v5sbmttp1b9cmbltim1r4i1pcm.apps.googleusercontent.com",
    }).then(() => {
      AsyncStorage.setItem("credentials", "");
      setStoreCredentials(null);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {storeCredentials ? (
        <Button onPress={handleGoogleSignOut} title="Sign Out" />
      ) : (
        <Button onPress={handleGoogleSignIn} title="Sign In with google" />
      )}
      <Text>{storeCredentials?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

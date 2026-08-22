import React, { useState, useEffect } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { BottomTabNavigator } from "./BottomTabNavigator"
import { LoginScreen } from "../screens/LoginScreen"
import { OnboardingScreen } from "../screens/OnboardingScreen"
import { CreateAutomationModal } from "../screens/CreateAutomationModal"
import { ChatThreadScreen } from "../screens/ChatThreadScreen"
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native"
import * as SecureStore from "expo-secure-store"

const Stack = createNativeStackNavigator()

const ONBOARDING_KEY = "insta_onboarding_done"

export const RootNavigator = () => {
  const { user, isLoading } = useAuth()
  const { colors } = useTheme()
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)

  useEffect(() => {
    checkOnboarding()
  }, [])

  const checkOnboarding = async () => {
    try {
      const done = await SecureStore.getItemAsync(ONBOARDING_KEY)
      setShowOnboarding(done !== "true")
    } catch {
      setShowOnboarding(true)
    }
  }

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true")
    } catch {}
    setShowOnboarding(false)
  }

  // ─── Branded Splash / Loading Screen ───
  if (isLoading || showOnboarding === null) {
    return (
      <View
        style={[
          styles.splashContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.logoCircle}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
          DM<Text style={{ color: "#1A73E8" }}>Spark</Text>
        </Text>
        <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
          Instagram Automation
        </Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#1A73E8" />
        </View>
      </View>
    )
  }

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
              name="CreateModal"
              component={CreateAutomationModal}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="ChatThread"
              component={ChatThreadScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "rgba(26, 115, 232, 0.3)",
    marginBottom: 20,
    shadowColor: "#1A73E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
    overflow: "hidden",
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  loaderContainer: {
    marginTop: 32,
  },
})

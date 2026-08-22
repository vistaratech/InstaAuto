import React, { useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native"
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs"
import { HomeScreen } from "../screens/HomeScreen"
import { AutomationsScreen } from "../screens/AutomationsScreen"
import { InboxScreen } from "../screens/InboxScreen"
import { SettingsScreen } from "../screens/SettingsScreen"
import { useTheme } from "../context/ThemeContext"
import {
  Home,
  Zap,
  Send,
  Sliders,
} from "lucide-react-native"
import * as Haptics from "expo-haptics"

const Tab = createBottomTabNavigator()

interface TabItemProps {
  label: string
  routeName: string
  isFocused: boolean
  onPress: () => void
  onLongPress: () => void
  colors: any
  isDark: boolean
}

const AnimatedTabItem: React.FC<TabItemProps> = ({
  label,
  routeName,
  isFocused,
  onPress,
  onLongPress,
  colors,
  isDark,
}) => {
  // Spring scale animation like Instagram
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.95)).current
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current
  const translateYAnim = useRef(new Animated.Value(isFocused ? -2 : 0)).current

  useEffect(() => {
    if (isFocused) {
      // Instagram Icon Pop Animation (bounce scale)
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.25,
            duration: 130,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3.5,
            tension: 80,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(translateYAnim, {
          toValue: -3,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isFocused])

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      friction: 4,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    if (!isFocused) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 4,
        useNativeDriver: true,
      }).start()
    }
  }

  const getIcon = () => {
    const iconSize = 22
    const activeColor = colors.primary
    const inactiveColor = colors.textMuted

    switch (routeName) {
      case "Home":
        return (
          <Home
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
            strokeWidth={isFocused ? 2.5 : 1.8}
          />
        )
      case "Automations":
        return (
          <Zap
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
            strokeWidth={isFocused ? 2.5 : 1.8}
            fill={isFocused ? activeColor : "transparent"}
          />
        )
      case "Inbox":
        return (
          <Send
            size={iconSize - 1}
            color={isFocused ? activeColor : inactiveColor}
            strokeWidth={isFocused ? 2.5 : 1.8}
            style={{ transform: [{ rotate: "-15deg" }] }}
          />
        )
      case "Settings":
        return (
          <Sliders
            size={iconSize}
            color={isFocused ? activeColor : inactiveColor}
            strokeWidth={isFocused ? 2.5 : 1.8}
          />
        )
      default:
        return <Home size={iconSize} color={inactiveColor} />
    }
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } catch {}
        onPress()
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        {/* Glowing Active Background Capsule */}
        <Animated.View
          style={[
            styles.activeBackgroundCapsule,
            {
              backgroundColor: isDark
                ? "rgba(26, 115, 232, 0.16)"
                : "rgba(26, 115, 232, 0.12)",
              borderColor: isDark
                ? "rgba(26, 115, 232, 0.35)"
                : "rgba(26, 115, 232, 0.2)",
              opacity: opacityAnim,
            },
          ]}
        />

        {/* Icon */}
        <View style={styles.iconWrapper}>{getIcon()}</View>

        {/* Instagram Active Dot */}
        <Animated.View
          style={[
            styles.activeDot,
            {
              backgroundColor: colors.primary,
              opacity: opacityAnim,
              transform: [{ scale: opacityAnim }],
            },
          ]}
        />
      </Animated.View>

      {/* Label */}
      <Text
        style={[
          styles.tabLabel,
          {
            color: isFocused ? colors.primary : colors.textMuted,
            fontWeight: isFocused ? "700" : "500",
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const InstagramTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors, isDark } = useTheme()

  return (
    <View style={styles.tabBarContainer}>
      <View
        style={[
          styles.tabBarPill,
          {
            backgroundColor: colors.tabBarBg,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
            borderTopColor: isDark
              ? "rgba(255, 255, 255, 0.16)"
              : "#FFFFFF",
            borderBottomColor: isDark
              ? "rgba(0, 0, 0, 0.45)"
              : "rgba(0, 0, 0, 0.06)",
            shadowColor: isDark ? "#000000" : "#64748B",
            shadowOpacity: isDark ? 0.4 : 0.12,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            })
          }

          return (
            <AnimatedTabItem
              key={route.key}
              label={label}
              routeName={route.name}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              colors={colors}
              isDark={isDark}
            />
          )
        })}
      </View>
    </View>
  )
}

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <InstagramTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Automations"
        component={AutomationsScreen}
        options={{
          tabBarLabel: "Automations",
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarLabel: "Inbox",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 22 : 14,
    left: 16,
    right: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: Platform.OS === "ios" ? 68 : 64,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 44,
    height: 34,
  },
  activeBackgroundCapsule: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 2,
    right: 2,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    position: "absolute",
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.1,
  },
})


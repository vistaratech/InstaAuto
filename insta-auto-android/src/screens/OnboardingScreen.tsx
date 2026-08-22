import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../context/ThemeContext"
import {
  MessageCircle,
  Zap,
  Shield,
  Instagram,
  ArrowRight,
  Sparkles,
} from "lucide-react-native"
import {
  getClayButtonStyle,
  getClayIconBoxStyle,
  getClayPillStyle,
} from "../theme/clayStyles"
import * as Haptics from "expo-haptics"

const { width } = Dimensions.get("window")

interface OnboardingSlide {
  id: string
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  highlight: string
}

interface OnboardingScreenProps {
  onComplete: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { colors, isDark } = useTheme()
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      icon: <MessageCircle size={48} color="#FFFFFF" />,
      iconBg: "#1A73E8",
      title: "Auto-Reply to Comments",
      subtitle:
        "When someone comments a keyword like \"link\" or \"price\" on your Reel, DMSpark instantly sends them a DM with your custom response.",
      highlight: "Works on specific Reels or all posts",
    },
    {
      id: "2",
      icon: <Zap size={48} color="#FFFFFF" />,
      iconBg: "#FF6D00",
      title: "DM Keyword Triggers",
      subtitle:
        "Set up keyword-based triggers for direct messages. When a follower DMs you \"info\" or \"help\", auto-reply with your pre-set message instantly.",
      highlight: "24/7 automated responses",
    },
    {
      id: "3",
      icon: <Shield size={48} color="#FFFFFF" />,
      iconBg: "#10B981",
      title: "Official Meta API",
      subtitle:
        "DMSpark uses the official Instagram Graph API with proper OAuth authentication. Your account is safe — no password sharing, no third-party hacks.",
      highlight: "Secure & Instagram-approved",
    },
  ]

  const handleNext = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {}

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      {/* 3D Inflated Clay Icon */}
      <View style={[styles.iconCircle, getClayIconBoxStyle(colors, item.iconBg, 110)]}>
        {item.icon}
      </View>

      {/* Title */}
      <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>{item.title}</Text>

      {/* Subtitle */}
      <Text style={[styles.slideSubtitle, { color: colors.textSecondary }]}>
        {item.subtitle}
      </Text>

      {/* Clay Highlight Badge */}
      <View style={[styles.highlightBadge, getClayPillStyle(colors, colors.primary, false)]}>
        <Sparkles size={15} color={colors.primaryLight} />
        <Text style={[styles.highlightText, { color: colors.primaryLight }]}>
          {item.highlight}
        </Text>
      </View>
    </View>
  )

  const isLastSlide = currentIndex === slides.length - 1

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Skip Button */}
      <View style={styles.topBar}>
        <View />
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Bottom Controls */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => {
            const isActive = index === currentIndex
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? colors.primary : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
                    width: isActive ? 30 : 10,
                  },
                ]}
              />
            )
          })}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            getClayButtonStyle(colors, isLastSlide ? "secondary" : "primary"),
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          {isLastSlide ? (
            <LinearGradient
              colors={["#F58529", "#DD2A7B", "#8134AF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Instagram size={21} color="#FFFFFF" />
              <Text style={styles.nextBtnText}>Get Started with Instagram</Text>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13.5,
    fontWeight: "500",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  slideSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
    fontWeight: "400",
  },
  highlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  highlightText: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  bottomBar: {
    paddingHorizontal: 22,
    gap: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    borderRadius: 22,
    overflow: "hidden",
    padding: 0,
  },
  nextBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  nextBtnText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
})


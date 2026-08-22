import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native"
import { WebView, WebViewNavigation } from "react-native-webview"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { X } from "lucide-react-native"
import { getClayIconBoxStyle } from "../../theme/clayStyles"

interface InstagramLoginWebViewProps {
  visible: boolean
  onClose: () => void
  onCodeReceived: (code: string) => void
  authUrl: string
  callbackBaseUrl?: string
}

export const InstagramLoginWebView: React.FC<InstagramLoginWebViewProps> = ({
  visible,
  onClose,
  onCodeReceived,
  authUrl,
}) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [codeHandled, setCodeHandled] = useState(false)

  const extractAndSendCode = (url: string): boolean => {
    if (codeHandled) return true

    // Check if redirect contains code parameter
    if (url.includes("code=")) {
      try {
        const urlObj = new URL(url)
        let code = urlObj.searchParams.get("code")
        if (code) {
          // Clean trailing hash if Instagram appends #_
          code = code.replace(/#_.*$/, "")
          if (code.length > 5) {
            setCodeHandled(true)
            onCodeReceived(code)
            return false // Stop loading redirect page
          }
        }
      } catch (e) {
        // Fallback regex extraction
        const match = url.match(/[?&]code=([^&#]+)/)
        if (match && match[1]) {
          setCodeHandled(true)
          onCodeReceived(match[1])
          return false
        }
      }
    }

    // Check for Instagram cancellation / error
    if (url.includes("error=") || url.includes("error_reason=") || url.includes("error_description=")) {
      handleClose()
      return false
    }

    return true
  }

  const handleNavigationChange = (navState: WebViewNavigation) => {
    extractAndSendCode(navState.url)
  }

  const handleShouldStartLoad = (event: { url: string }) => {
    return extractAndSendCode(event.url)
  }

  const handleClose = () => {
    setCodeHandled(false)
    setLoading(true)
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Header Bar */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              backgroundColor: colors.background,
              borderBottomColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.closeBtn, getClayIconBoxStyle(colors, colors.textPrimary, 38)]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Instagram Authorization
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Instagram OAuth WebView */}
        <WebView
          source={{ uri: authUrl }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={[styles.loadingOverlay, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Opening Instagram Login...
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "700",
  },
})


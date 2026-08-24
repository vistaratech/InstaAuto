export const API_CONFIG = {
  // Production Live Cloud Backend (Neon PostgreSQL + Meta API)
  DEFAULT_BACKEND_URL: "https://www.dmspark.in",
  
  // Real Instagram OAuth configuration from Meta Developer Console
  INSTAGRAM_APP_ID: "4341279666187863",
  INSTAGRAM_REDIRECT_URI: "https://www.dmspark.in/api/instagram/callback",
  INSTAGRAM_SCOPE: "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights",
  
  // Storage keys for Android SecureStore
  STORAGE_KEYS: {
    USER_ID: "insta_user_id",
    USERNAME: "insta_username",
    AUTH_TOKEN: "insta_auth_token",
    BACKEND_URL: "insta_custom_backend_url",
    PROFILE_PIC: "insta_profile_pic",
  }
}

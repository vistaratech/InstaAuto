"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useWhatsAppSession() {
    const [waUsername, setWaUsername] = useState<string | null>(null)
    const [waUserId, setWaUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const savedId = localStorage.getItem("wa_user_id")
        const savedName = localStorage.getItem("wa_username")

        if (savedId && savedName) {
            setWaUserId(savedId)
            setWaUsername(savedName)
        }
        setIsLoading(false)
    }, [])

    const loginWhatsApp = (phoneNumber: string, businessName: string) => {
        setIsLoading(true)
        localStorage.setItem("wa_user_id", phoneNumber)
        localStorage.setItem("wa_username", businessName)
        localStorage.setItem("login_type", "whatsapp")
        
        setWaUserId(phoneNumber)
        setWaUsername(businessName)
        setIsLoading(false)
        router.push("/whatsapp-dashboard")
    }

    const logoutWhatsApp = () => {
        localStorage.removeItem("wa_user_id")
        localStorage.removeItem("wa_username")
        localStorage.removeItem("login_type")
        
        setWaUsername(null)
        setWaUserId(null)
        setError(null)
        router.push("/")
    }

    return { waUserId, waUsername, isLoading, error, loginWhatsApp, logoutWhatsApp }
}

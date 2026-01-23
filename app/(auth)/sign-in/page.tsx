'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <SignIn
                appearance={{
                    elements: {
                        card: "bg-black/40 border border-white/20 rounded-xl",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-white/10 border-white/20 text-white",
                        formButtonPrimary: "bg-white text-black hover:bg-gray-200",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-white",
                    },
                }}
                redirectUrl="/"
            />
        </div>
    )
}

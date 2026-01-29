'use client'
import { Suspense } from "react"
import NotesPage from "./NotesPage"

export default function Page() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
            <NotesPage />
        </Suspense>
    )
}


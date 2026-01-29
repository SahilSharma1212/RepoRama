'use client'
import { ChevronDown, Notebook, Search } from "lucide-react"
import { Suspense } from "react"
import NotesPage from "./NotesPage"

export default function page() {

    return (

        <Suspense fallback={<div>Loading...</div>}>
            <NotesPage />
        </Suspense>
    )
}

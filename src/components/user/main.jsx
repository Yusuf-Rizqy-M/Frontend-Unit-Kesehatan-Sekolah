import { useState } from 'react'

function Main({ slot }) {
    return (
        <main className="p-4 pt-1">
            {slot}
        </main>
    )
}

export default Main

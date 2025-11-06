"use client"

import { useEffect, useState } from "react"

export function DynamicYear() {
  const [year, setYear] = useState<string>("2025")

  useEffect(() => {
    // Update the year when component mounts on client
    setYear(new Date().getFullYear().toString())
  }, [])

  return <span>{year}</span>
}
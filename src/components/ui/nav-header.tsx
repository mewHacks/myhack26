"use client"

import React, { useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

type NavTab = {
  href: string
  label: string
  color: string
}

type NavHeaderProps = {
  items?: NavTab[]
  className?: string
}

type CursorPosition = {
  left: number
  width: number
  opacity: number
  backgroundColor: string
}

const defaultItems: NavTab[] = [
  { href: "/", label: "Home", color: "#000000" },
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-yellow)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-green)" },
  { href: "/", label: "Contact", color: "#000000" },
]

export default function NavHeader({ items = defaultItems, className = "" }: NavHeaderProps) {
  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
    backgroundColor: "#000000",
  })
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  return (
    <ul
      className={`relative mx-auto flex w-fit rounded-full bg-white p-1 ${className}`}
      onMouseLeave={() => {
        setPosition((previous) => ({ ...previous, opacity: 0 }))
        setActiveLabel(null)
      }}
      onBlur={() => setActiveLabel(null)}
    >
      {items.map((item) => (
        <Tab
          key={item.label}
          href={item.href}
          color={item.color}
          label={item.label}
          isActive={activeLabel === item.label}
          setActiveLabel={setActiveLabel}
          setPosition={setPosition}
        >
          {item.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  )
}

function Tab({
  children,
  href,
  color,
  label,
  isActive,
  setActiveLabel,
  setPosition,
}: {
  children: React.ReactNode
  href: string
  color: string
  label: string
  isActive: boolean
  setActiveLabel: (label: string | null) => void
  setPosition: React.Dispatch<React.SetStateAction<CursorPosition>>
}) {
  const ref = useRef<HTMLLIElement>(null)

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return

        const { width } = ref.current.getBoundingClientRect()

        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
          backgroundColor: color,
        })
        setActiveLabel(label)
      }}
      onMouseLeave={() => {
        setActiveLabel(null)
      }}
      style={{ color }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase transition duration-200 md:px-5 md:py-3 md:text-base"
    >
      <Link
        href={href}
        className="relative z-10"
        onFocus={() => setActiveLabel(label)}
        onBlur={() => setActiveLabel(null)}
      >
        <span
          className={`font-press-start-2p transition-colors duration-200 ${
            isActive ? "text-white" : "hover:text-white"
          }`}
        >
          {children}
        </span>
      </Link>
    </li>
  )
}

function Cursor({ position }: { position: CursorPosition }) {
  return (
    <motion.li
      animate={position}
      className="absolute top-0 left-0 z-0 h-full rounded-full"
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      style={{ backgroundColor: position.backgroundColor }}
    />
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavMenuClient({
  rubrics,
}: {
  rubrics: { id: number; slug: string; name: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          {/* Главная — всегда слева */}
          <div className="nav-left">
            <Link href="/" className="nav-home">
              Главная
            </Link>
          </div>

          {/* Навигация по рубрикам — только на десктопе */}
          <ul className="nav-desktop">
            {rubrics.map((rubric) => (
              <li key={rubric.id}>
                <Link href={`/rubrics/${rubric.slug}`}>{rubric.name}</Link>
              </li>
            ))}
          </ul>

          {/* Бургер — только на мобильных */}
          <div className="nav-right">
            <button
              className={`burger-button ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      <div className={`mobile-nav-wrapper ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-nav">
          {rubrics.map((rubric) => (
            <li key={rubric.id}>
              <Link href={`/rubrics/${rubric.slug}`} onClick={() => setIsOpen(false)}>
                {rubric.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

import React, { useState, createContext } from 'react'
import type { AppProps } from 'next/app'
import '../src/styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'

export const TokenContext = createContext(null)

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  })

  return (
    <>
      <Head>
        <title>Notepad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TokenContext.Provider value={[tokens, setTokens]}>
        <div className="bg-almost_white">
          <div className="flex min-h-screen flex-col max-w-screen-desktop mx-auto">
            <header className="p-2">
              <Link href="/">
                <a className="mr-4 hover:text-salmon_fish border-almost_white hover:border-salmon_fish border-solid border-b-2">
                  home
                </a>
              </Link>
              <Link href="/notes">
                <a className="mr-4 hover:text-salmon_fish border-almost_white hover:border-salmon_fish border-solid border-b-2">
                  notes
                </a>
              </Link>
            </header>

            <main className="flex-1 p-3">
              <Component {...pageProps} />
            </main>

            <footer className="p-2">
              <p>Marek Sokol 2021</p>
            </footer>
          </div>
        </div>
      </TokenContext.Provider>
    </>
  )
}

export default MyApp

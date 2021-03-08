import React from 'react'
import type { AppProps } from 'next/app'
import '../src/styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { CookiesProvider, useCookies } from 'react-cookie'

const MyApp = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies()

  return (
    <>
      <Head>
        <title>notepad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CookiesProvider>
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

              <button
                style={{ outline: 'none', border: 'none' }}
                className="float-right"
                onClick={() => {
                  axios({
                    method: 'post',
                    url: `http://localhost:5000/logout`,
                    data: {
                      token: cookies['refreshToken']?.refreshToken,
                    },
                  })
                    .then(() => {
                      removeCookie('accessToken', {
                        path: '/',
                      })
                      removeCookie('refreshToken', {
                        path: '/',
                      })
                    })
                    .catch(() => {
                      alert('Bad request!')
                    })
                }}
              >
                <a className="mr-4 hover:text-salmon_fish border-almost_white hover:border-salmon_fish border-solid border-b-2">
                  logout
                </a>
              </button>
            </header>

            <main className="flex-1 p-3">
              <Component {...pageProps} />
            </main>

            <footer className="p-2">
              <p>Marek Sokol 2021</p>
            </footer>
          </div>
        </div>
      </CookiesProvider>
    </>
  )
}

export default MyApp

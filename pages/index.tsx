import Head from 'next/head'

const Homepage = () => (
  <>
    <Head>
      <title>Notepad</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <body className="flex min-h-screen flex-col">
      <header>
        <p>Header</p>
      </header>

      <main className="flex-1">
        <p>Main</p>
      </main>

      <footer>
        <p>Footer</p>
      </footer>
    </body>
  </>
)

export default Homepage

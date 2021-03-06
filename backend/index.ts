const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const port = 5000

// Supposed to be environmental variable
const ACCESS_TOKEN = 'jgfwefiohweg'
const REFRESH_TOKEN = 'bksdfbmyxcyxv'

let refreshTokens: string[] = []

// Supposed to be in database, pwds should be also hashed
const notes = [
  {
    username: 'user',
    password: 'password',
    notes: [
      { title: 'Buy milk!', description: 'You really should.' },
      { title: 'Buy cake!', description: 'But you dont need it.' },
    ],
  },
  {
    username: 'admin',
    password: 'password',
    notes: [
      { title: 'Do your stuff!', description: 'You really should.' },
      { title: null, description: null },
    ],
  },
]

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
  bodyParser.json({ extended: true }),
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authToken = (req: any, res: any, next: any) => {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify(token, ACCESS_TOKEN, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const generateAccessToken = (user: { name: string }) => {
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: '90s' })
  // zmenit na 30m
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/notes', authToken, (req: any, res: any) => {
  res.json({ notes: notes.filter((note) => note.username === req.user.name) })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/login', (req: any, res: any) => {
  const username = req.body.username
  const password = req.body.password

  if (
    notes.filter(
      (note) => note.username === username && note.password === password,
    ).length !== 0
  ) {
    console.log(username, password)

    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, REFRESH_TOKEN)
    refreshTokens.push(refreshToken)

    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  } else {
    res.sendStatus(401)
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/token', (req: any, res: any) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify(refreshToken, REFRESH_TOKEN, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

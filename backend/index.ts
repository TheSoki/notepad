const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const Yup = require('yup')

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
]

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
  password: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
})

const NewNoteSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
  password: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
  title: Yup.string().max(64, 'Too long!'),
  description: Yup.string().max(500, 'Too long!'),
})

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
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: '30m' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/notes', authToken, (req: any, res: any) => {
  res.json({ notes: notes.filter((note) => note.username === req.user.name) })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/login', (req: any, res: any) => {
  const username = req.body.username
  const password = req.body.password

  LoginSchema.isValid({
    username: req.body.username,
    password: req.body.password,
  })
    .then((valid: boolean) => {
      if (valid) {
        if (
          notes.filter(
            (note) => note.username === username && note.password === password,
          ).length !== 0
        ) {
          const user = { name: username }
          const accessToken = generateAccessToken(user)
          const refreshToken = jwt.sign(user, REFRESH_TOKEN)
          refreshTokens.push(refreshToken)

          res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
          res.sendStatus(401)
        }
      } else {
        res.sendStatus(400)
      }
    })
    .catch(() => {
      res.sendStatus(400)
    })
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/logout', (req: any, res: any) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/register', (req: any, res: any) => {
  const username = req.body.username
  const password = req.body.password

  LoginSchema.isValid({
    username: req.body.username,
    password: req.body.password,
  })
    .then((valid: boolean) => {
      if (valid) {
        if (notes.filter((note) => note.username === username).length === 0) {
          notes.push({
            username: username,
            password: password,
            notes: [],
          })

          res.sendStatus(200)
        } else {
          res.sendStatus(401)
        }
      } else {
        res.sendStatus(400)
      }
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/addnote', authToken, (req: any, res: any) => {
  NewNoteSchema.isValid(req.body)
    .then((valid: boolean) => {
      if (valid) {
        notes.forEach((note, index) => {
          if (
            note.username === req.body.username &&
            note.password === req.body.password
          ) {
            notes[index].notes.push({
              title: req.body.title,
              description: req.body.description,
            })
          }
        })
        res.json(200)
      } else {
        res.sendStatus(400)
      }
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.post('/deletenote', authToken, (req: any, res: any) => {
  NewNoteSchema.isValid(req.body)
    .then((valid: boolean) => {
      if (valid) {
        notes.forEach((user, index) => {
          if (
            user.username === req.body.username &&
            user.password === req.body.password
          ) {
            user.notes.forEach((n) => {
              if (
                n.title === req.body.title &&
                n.description === req.body.description
              ) {
                notes[index].notes = user.notes.filter((m) => m !== n)
              }
            })
          }
        })

        res.json(200)
      } else {
        res.sendStatus(400)
      }
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

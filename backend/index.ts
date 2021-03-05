const express = require('express')

const app = express()
const port = 5000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/', (req: any, res: any) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

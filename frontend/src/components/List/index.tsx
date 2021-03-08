import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '@material-ui/core/Modal'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FormControl, Input, InputLabel } from '@material-ui/core'
import { useCookies } from 'react-cookie'

const NoteSchema = Yup.object().shape({
  title: Yup.string().max(64, 'Too long!'),
  description: Yup.string().max(500, 'Too long!'),
})

const List = () => {
  const [cookies, setCookie] = useCookies(['accessToken'])

  const [data, setData] = useState({
    state: 'loading',
    payload: null,
  })
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openSpecsModal, setOpenSpecsModal] = useState(false)
  const [noteSpecs, setNoteSpecs] = useState({
    title: '',
    description: '',
  })

  const getDataOrNewToken = () => {
    axios({
      method: 'get',
      url: `http://localhost:5000/notes`,
      headers: { Authorization: `Bearer ${cookies.accessToken}` },
    })
      .then((res) => {
        setData({
          state: 'loaded',
          payload: res.data,
        })
      })
      .catch(() => {
        axios({
          method: 'post',
          url: `http://localhost:5000/token`,
          data: {
            token: cookies.refreshToken,
          },
        })
          .then((res) => {
            const newAccessToken = res.data.accessToken

            setCookie('accessToken', newAccessToken, {
              path: '/',
            })

            axios({
              method: 'get',
              url: `http://localhost:5000/notes`,
              headers: { Authorization: `Bearer ${newAccessToken}` },
            })
              .then((res) => {
                setData({
                  state: 'loaded',
                  payload: res.data,
                })
              })
              .catch(() => {
                setData({
                  state: 'error',
                  payload: null,
                })
              })
          })
          .catch(() => {
            setData({
              state: 'error',
              payload: null,
            })
          })
      })
  }

  useEffect(() => {
    getDataOrNewToken()
  }, [])

  return (
    <>
      {data.state === 'loading' && <h5 className="text-center">loading</h5>}
      {data.state === 'error' && (
        <h5 className="text-center">you are not logged in</h5>
      )}
      {data.state === 'loaded' && (
        <>
          <div className="flex flex-wrap">
            {data.payload.notes[0].notes.map((note, index) => (
              <div
                key={index}
                className="w-full tablet:w-1/2 laptop:w-1/3 desktop:w-1/4 p-1"
              >
                <div
                  className="bg-newspaper_like p-1 rounded cursor-pointer"
                  onClick={() => {
                    setOpenSpecsModal(true)
                    setNoteSpecs({
                      title: note.title,
                      description: note.description,
                    })
                  }}
                >
                  <h3 style={{ whiteSpace: 'break-spaces' }}>
                    {note.title.length === 0
                      ? ' '
                      : note.title.length > 20
                      ? note.title.slice(0, 20) + '...'
                      : note.title}
                  </h3>
                  <h5 style={{ whiteSpace: 'break-spaces' }}>
                    {note.description.length === 0
                      ? ' '
                      : note.description.length > 40
                      ? note.description.slice(0, 40) + '...'
                      : note.description}
                  </h5>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              border: 'none',
              outline: 'none',
              width: 50,
              height: 50,
              fontSize: 30,
              borderRadius: 30,
            }}
            className="bg-green-500"
            onClick={() => setOpenAddModal(true)}
          >
            +
          </button>

          <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
            <div
              className="mx-auto bg-almost_white p-2"
              style={{
                width: '90%',
                maxWidth: 450,
                minHeight: '80vh',
                marginTop: '5vh',
                border: 'none',
                outline: 'none',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Formik
                initialValues={{
                  title: '',
                  description: '',
                }}
                validationSchema={NoteSchema}
                onSubmit={(values, { resetForm }) => {
                  axios({
                    method: 'post',
                    url: `http://localhost:5000/addnote`,
                    headers: { Authorization: `Bearer ${cookies.accessToken}` },
                    data: {
                      username: data.payload.notes[0].username,
                      password: data.payload.notes[0].password,
                      title: values.title,
                      description: values.description,
                    },
                  })
                    .then(() => {
                      getDataOrNewToken()
                      resetForm()
                      setOpenAddModal(false)
                    })
                    .catch(() => {
                      getDataOrNewToken()
                      alert('Bad request!')
                    })
                }}
              >
                {({ handleSubmit }) => (
                  <Form
                    onSubmit={handleSubmit}
                    name="AddNewNote"
                    style={{
                      width: '100%',
                      marginTop: 30,
                    }}
                    className="mx-auto"
                  >
                    <div className="flex flex-wrap flex-col items-center">
                      <Field name="title">
                        {({ field, meta }) => (
                          <>
                            <FormControl style={{ width: '95%' }}>
                              <InputLabel>Title</InputLabel>
                              <Input {...field} />
                            </FormControl>

                            <h5
                              style={{
                                visibility:
                                  meta.touched && meta.error
                                    ? 'inherit'
                                    : 'hidden',
                              }}
                              className="text-red-700"
                            >
                              {meta.error ? meta.error : 'No errors'}
                            </h5>
                          </>
                        )}
                      </Field>

                      <Field name="description">
                        {({ field, meta }) => (
                          <>
                            <FormControl style={{ width: '95%' }}>
                              <InputLabel>Description</InputLabel>
                              <Input {...field} multiline />
                            </FormControl>

                            <h5
                              style={{
                                visibility:
                                  meta.touched && meta.error
                                    ? 'inherit'
                                    : 'hidden',
                              }}
                              className="text-red-700"
                            >
                              {meta.error ? meta.error : 'No errors'}
                            </h5>
                          </>
                        )}
                      </Field>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: 'linear-gradient(90deg, #ffafbd, #ffc3a0)',
                        height: 30,
                        width: 120,
                        border: 'none',
                        outline: 'none',
                      }}
                      className="text-white rounded mt-4 float-left"
                      onClick={() => setOpenAddModal(false)}
                    >
                      close
                    </button>

                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(90deg, #ffafbd, #ffc3a0)',
                        height: 30,
                        width: 120,
                        border: 'none',
                        outline: 'none',
                      }}
                      className="text-white rounded mt-4 float-right"
                    >
                      save
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal>

          <Modal open={openSpecsModal} onClose={() => setOpenSpecsModal(false)}>
            <div
              className="mx-auto bg-almost_white p-2"
              style={{
                width: '90%',
                maxWidth: 450,
                minHeight: '80vh',
                marginTop: '5vh',
                border: 'none',
                outline: 'none',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <h3 style={{ whiteSpace: 'break-spaces' }}>
                {noteSpecs.title.length === 0 ? ' ' : noteSpecs.title}
              </h3>
              <h5 style={{ whiteSpace: 'break-spaces' }}>
                {noteSpecs.description.length === 0
                  ? ' '
                  : noteSpecs.description}
              </h5>

              <button
                style={{
                  background: 'linear-gradient(90deg, #ffafbd, #ffc3a0)',
                  height: 30,
                  width: 120,
                  border: 'none',
                  outline: 'none',
                }}
                className="text-white rounded mt-4 float-left"
                onClick={() => setOpenSpecsModal(false)}
              >
                close
              </button>

              <button
                style={{
                  background: 'linear-gradient(90deg, #ffafbd, #ffc3a0)',
                  height: 30,
                  width: 120,
                  border: 'none',
                  outline: 'none',
                }}
                className="text-white rounded mt-4 float-right"
                onClick={() => {
                  axios({
                    method: 'post',
                    url: `http://localhost:5000/deletenote`,
                    headers: { Authorization: `Bearer ${cookies.accessToken}` },
                    data: {
                      username: data.payload.notes[0].username,
                      password: data.payload.notes[0].password,
                      title: noteSpecs.title,
                      description: noteSpecs.description,
                    },
                  })
                    .then(() => {
                      getDataOrNewToken()
                      setOpenSpecsModal(false)
                    })
                    .catch(() => {
                      getDataOrNewToken()
                      alert('Bad request!')
                    })
                }}
              >
                delete
              </button>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

export default List

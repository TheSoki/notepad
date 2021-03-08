import React, { useState } from 'react'
import { Field, Formik, Form } from 'formik'
import axios from 'axios'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import * as Yup from 'yup'
import Link from 'next/link'
import { useCookies } from 'react-cookie'

export const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
  password: Yup.string()
    .min(4, 'Too short!')
    .max(64, 'Too long!')
    .required('Mandatory'),
})

const Login = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies()
  const [logged, setLogged] = useState(false)

  const InputFields = [
    { name: 'username', label: 'Username' },
    { name: 'password', label: 'Password' },
  ]
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={(values, { resetForm }) => {
          axios({
            method: 'post',
            url: `http://localhost:5000/login`,
            data: {
              ...values,
            },
          })
            .then((res) => {
              resetForm()
              setCookie('accessToken', res.data.accessToken, {
                path: '/',
              })
              setCookie('refreshToken', res.data.refreshToken, {
                path: '/',
              })

              setLogged(true)
            })
            .catch(() => {
              setLogged(false)
              alert('Bad request!')
            })
        }}
      >
        {({ handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            name="Login"
            style={{
              width: '90%',
              maxWidth: 450,
            }}
            className="mx-auto flex flex-wrap flex-col items-center"
          >
            {InputFields.map((singleInputField, id) =>
              singleInputField.name !== 'password' ? (
                <Field name={singleInputField.name} key={id}>
                  {({ field, meta }) => (
                    <>
                      <FormControl style={{ width: '95%' }}>
                        <InputLabel>{singleInputField.label}</InputLabel>
                        <Input {...field} />
                      </FormControl>

                      <h5
                        style={{
                          visibility:
                            meta.touched && meta.error ? 'inherit' : 'hidden',
                        }}
                        className="text-red-700"
                      >
                        {meta.error ? meta.error : 'No errors'}
                      </h5>
                    </>
                  )}
                </Field>
              ) : (
                <Field name={singleInputField.name} key={id}>
                  {({ field, meta }) => (
                    <>
                      <FormControl style={{ width: '95%' }}>
                        <InputLabel>Password</InputLabel>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(event) => event.preventDefault()}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <h5
                        style={{
                          visibility:
                            meta.touched && meta.error ? 'inherit' : 'hidden',
                        }}
                        className="text-red-700"
                      >
                        {meta.error ? meta.error : 'No errors'}
                      </h5>
                    </>
                  )}
                </Field>
              ),
            )}

            <button
              type="submit"
              style={{
                background: !logged
                  ? 'linear-gradient(90deg, #ffafbd, #ffc3a0)'
                  : 'green',
                height: 30,
                width: 120,
                border: 'none',
                outline: 'none',
              }}
              className="text-white rounded mt-4"
            >
              {!logged ? 'Log in' : '✓'}
            </button>

            <p className="my-4">or</p>

            <button
              type="button"
              style={{
                background: 'linear-gradient(90deg, #ffafbd, #ffc3a0)',
                height: 30,
                width: 120,
                border: 'none',
                outline: 'none',
              }}
              className="text-white rounded mt-4"
            >
              <Link href="/register">
                <a>Register</a>
              </Link>
            </button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default Login

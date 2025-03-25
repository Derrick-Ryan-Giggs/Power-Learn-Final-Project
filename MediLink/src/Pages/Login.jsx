import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // This useEffect now properly placed at the top level of the component
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={onSubmitHandler} 
          className="bg-white shadow-2xl rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {state === 'Sign Up' ? "Create Account" : "Login"}
          </h2>
          <p className="text-gray-600 mb-6"> 
            Please {state === 'Sign Up' ? "sign up" : "login"} to book an appointment
          </p>

          {state === "Sign Up" && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <input 
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                required 
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input 
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              required 
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input 
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-medium"
          >
            {state === 'Sign Up' ? "Create Account" : "Login"}
          </button>
          
          <div className="mt-4 text-center text-sm">
            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState('Login')}
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState('Sign Up')}
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Sign up here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
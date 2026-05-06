// authService.js
import axios from 'axios'
import { API_ROOT } from './api'

const API_URL = `${API_ROOT}/api/auth`

// Configure axios to include credentials and handle CORS properly
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true

// Interceptor para adjuntar el token a todas las peticiones de axios
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const authService = {

  // REGISTER: Debe retornar una promesa que resuelve en { data: { token: '...' } }
  register: (nombre, email, password) => {
    return axios.post(`${API_URL}/register`, {
      nombre,
      email,
      password,
      confirmPassword: password
    })
  },

  // LOGIN (username or email)
  login: async (usuarioOrEmail, password) => {
    return axios.post(`${API_URL}/login`, { usuarioOrEmail, password })
  },

  // GOOGLE LOGIN (token del botón Google Identity)
  googleLogin: (credentialToken) => {
    // Log para debugging
    console.log('📤 Enviando google login con credential:', credentialToken ? 'Token presente' : 'Token vacío')

    return axios.post(`${API_URL}/google-login`, { credential: credentialToken }, {
      // Configuración adicional para CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000 // 15 second timeout
    }).then(response => {
      console.log('✅ Google login exitoso:', response.data)
      // Guardar token Y datos de usuario en el mismo .then()
      if (response.data?.token) {
        authService.saveToken(response.data.token)
      }
      if (response.data?.user) {
        authService.setUserData(response.data.user)
      }
      return response
    }).catch(error => {
      console.error('❌ Error Google login:', error.response?.data || error.message)
      throw error // Re-lanzar el error para que el calling code pueda manejarlo
    })
  },

  // SAVE TOKEN
  saveToken: (token) => {
    if (typeof token === 'string') {
      localStorage.setItem('user_token', token)
    }
  },

  // SAVE USER DATA
  setUserData: ({ username, nombre, email, googleUser, picture, role }) => {
    const displayName = username || nombre || ''
    localStorage.setItem('user_name', displayName)
    localStorage.setItem('user_email', email || '')
    localStorage.setItem('user_google', googleUser ? 'true' : 'false')
    if (role) {
      localStorage.setItem('user_role', role)
    }

    let validPic = ''
    if (picture && typeof picture === 'string') {
      validPic = picture.startsWith('http') ? picture : 'https:' + picture
    }
    localStorage.setItem('user_photo', validPic)
    localStorage.setItem('user_initial', displayName ? displayName.charAt(0).toUpperCase() : '?')
  },

  // CHECK AUTH
  isAuthenticated: () => {
    return Boolean(localStorage.getItem('user_token'))
  }
}

export default authService

// authService.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const API_URL = `${BASE_URL}/api/auth`

// Configure axios to include credentials and handle CORS properly
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true

const authService = {

  // REGISTER: Debe retornar una promesa que resuelve en { data: { token: '...' } }
  register: (username, email, password) => {
    return axios.post(`${API_URL}/register`, { username, email, password })
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
      return response
    }).then(response => { // <-- Encadenar para procesar la respuesta
      if (response.data && response.data.user) authService.setUserData(response.data.user)
    }).catch(error => {
      // Log detallado del error para debugging
      if (error.response) {
        console.error('❌ Error Google login - Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        })
      } else if (error.request) {
        console.error('❌ Error Google login - No response received:', error.request)
      } else {
        console.error('❌ Error Google login:', error.message)
      }
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
  setUserData: ({ username, email, googleUser, picture, role }) => { // <-- Añadir 'role'
    localStorage.setItem('user_name', username || '')
    localStorage.setItem('user_email', email || '')
    localStorage.setItem('google_user', googleUser ? 'true' : 'false')
    if (role) { // <-- Guardar el rol si está presente
      localStorage.setItem('user_role', role)
    }

    let validPic = ''
    if (picture && typeof picture === 'string') { // <-- Mantener la lógica de la foto
      validPic = picture.startsWith('http') ? picture : 'https:' + picture
    }

    localStorage.setItem('user_photo', validPic)
  },

  // CHECK AUTH
  isAuthenticated: () => {
    return Boolean(localStorage.getItem('user_token'))
  }
}

export default authService

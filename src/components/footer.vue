<template>
  <footer class="ft">
    <div class="ft-grid">

      <!-- Col 1: Brand -->
      <div>
        <div class="ft-logo-img">
          <img src="../assets/img/logo1.png" alt="Hotelier" class="ft-logo-real" />
        </div>
        <p class="ft-brand">Hotelier</p>
        <p class="ft-tag">Planea tu viaje con confianza.<br />Más de 10,000 destinos en el mundo.</p>
        <div class="badge"><div class="badge-dot"></div> Soporte 24/7 disponible</div>
        <div class="ft-socials">
          <a class="ft-soc" href="#" title="Facebook">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-4c-3.86 0-5 1.763-5 4.333v2.667z"/>
            </svg>
          </a>
          <a class="ft-soc" href="#" title="Instagram">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a class="ft-soc" href="#" title="Twitter/X">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a class="ft-soc" href="#" title="LinkedIn">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Col 2: Servicios -->
      <div>
        <p class="ft-col-title">Servicios</p>
        <ul class="ft-links">
          <li><router-link to="/hospedaje">Hospedaje <span class="arrow">›</span></router-link></li>
          <li><router-link to="/vuelos">Vuelos <span class="arrow">›</span></router-link></li>
          <li><router-link to="/autos">Alquiler de Autos <span class="arrow">›</span></router-link></li>
          <li><router-link to="/paquetes">Paquetes Turísticos <span class="arrow">›</span></router-link></li>
          <li><router-link to="/actividades">Actividades <span class="arrow">›</span></router-link></li>
          <li><router-link to="/cruceros">Cruceros <span class="arrow">›</span></router-link></li>
        </ul>
      </div>

      <!-- Col 3: Compañía -->
      <div>
        <p class="ft-col-title">Compañía</p>
        <ul class="ft-links">
          <li><router-link to="/sobre-nosotros">Sobre Nosotros <span class="arrow">›</span></router-link></li>
          <li><router-link to="/blog">Blog de Viajes <span class="arrow">›</span></router-link></li>
          <li><router-link to="/ofertas">Ofertas Especiales <span class="arrow">›</span></router-link></li>
          <li><router-link to="/contacto">Contacto <span class="arrow">›</span></router-link></li>
          <li><router-link to="/trabajos">Trabaja con Nosotros <span class="arrow">›</span></router-link></li>
        </ul>
      </div>

      <!-- Col 4: Soporte -->
      <div>
        <p class="ft-col-title">Soporte</p>
        <ul class="ft-links">
          <li><router-link to="/servicio-cliente">Centro de Ayuda <span class="arrow">›</span></router-link></li>
          <li><router-link to="/privacidad">Política de Privacidad <span class="arrow">›</span></router-link></li>
          <li><router-link to="/terminos">Términos y Condiciones <span class="arrow">›</span></router-link></li>
          <li><router-link to="/cookies">Política de Cookies <span class="arrow">›</span></router-link></li>
          <li><a href="mailto:soporte@hotelier.com">soporte@hotelier.com <span class="arrow">›</span></a></li>
        </ul>
      </div>

      <!-- Col 5: Newsletter + Contacto -->
      <div>
        <p class="ft-col-title">Mantente conectado</p>
        <p class="ft-desc">Recibe ofertas exclusivas y consejos de viaje directo a tu correo.</p>
        <div class="ft-input-wrap">
          <input
            class="ft-input"
            type="email"
            placeholder="tu@correo.com"
            v-model="email"
          />
          <button class="ft-btn" @click="subscribeNewsletter">Suscribirse al newsletter</button>
        </div>
        <div class="ft-contact">
          <div class="ft-contact-item">
            <div class="ft-contact-icon">
              <svg width="13" height="13" fill="none" stroke="#2dd4bf" stroke-width="1.8" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.59 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.5 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.18 6.18l.91-.76a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            +1 (555) 123-4567
          </div>
          <div class="ft-contact-item">
            <div class="ft-contact-icon">
              <svg width="13" height="13" fill="none" stroke="#2dd4bf" stroke-width="1.8" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            info@hotelier.com
          </div>
        </div>
      </div>

    </div>

    <div class="ft-divider"></div>

    <div class="ft-bottom">
      <p class="ft-copy">© 2026 Hotelier. Todos los derechos reservados.</p>
      <div class="ft-bottom-links">
        <router-link to="/privacidad">Privacidad</router-link>
        <router-link to="/terminos">Términos de uso</router-link>
        <router-link to="/cookies">Cookies</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const subscribeNewsletter = () => {
  if (!email.value) {
    alert('Por favor ingresa un correo electrónico')
    return
  }
  console.log('Suscrito:', email.value)
  alert('¡Gracias por suscribirte!')
  email.value = ''
}
</script>

<style scoped src="../assets/css/footer.css"></style>
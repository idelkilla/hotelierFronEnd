<template>
  <div class="contenedor-detalles">
    <div class="info-hotel">
      <h1 class="nombre-hotel">Paradisus Palma Real</h1>
      <div class="rating-ubicacion">
        <span class="ubicacion">Puerto Plata, Rep. Dom</span>
      
      </div>

      <h2 class="subtitulo">Sobre Paradisus Palma Real</h2>
      <p class="descripcion">
        Paradisus Palma Real es un exclusivo resort boutique ubicado frente a una de las playas más tranquilas y privadas de Punta Cana. Este hotel combina elegancia contemporánea con detalles caribeños, ofreciendo un ambiente sofisticado y relajado al mismo tiempo. Sus instalaciones están rodeadas de jardines tropicales, senderos iluminados y áreas diseñadas para brindar experiencias de descanso y conexión con la naturaleza.
      </p>

      <h2 class="subtitulo">Servicios populares</h2>
      <div class="servicios-grid">
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M6 11l4 -2l3.5 3l-1.5 2" /><path d="M3 16.75a2.4 2.4 0 0 0 1 .25a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 1 -.25" /></svg>
          Piscina
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 12h1" /><path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2" /><path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1" /><path d="M9 12h6" /><path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1" /><path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2" /><path d="M22 12h-1" /></svg>
          GYM
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 18l.01 0" /><path d="M9.172 15.172a4 4 0 0 1 5.656 0" /><path d="M6.343 12.343a8 8 0 0 1 11.314 0" /><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" /></svg>
          WIFI
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151" /><path d="M6.161 17.009l11.839 -.009" /></svg>
          Chef
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 9a10 10 0 1 0 20 0" /><path d="M12 19a10 10 0 0 1 10 -10" /><path d="M2 9a10 10 0 0 1 10 10" /><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" /><path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" /></svg>
          Spa
        </div>
      </div>
    </div>

    <div class="card-reserva">
      <div class="precio-noche">
        <span class="monto">$890</span>
        <span class="etiqueta">/noche</span>
      </div>

      <div class="inputs-fecha">
        <div class="campo">
          <label>CHECK-IN</label>
          <input type="text" placeholder="1/12/2025">
        </div>
        <div class="campo">
          <label>CHECK-OUT</label>
          <input type="text" placeholder="1/1/2026">
        </div>
      </div>

      <div class="campo-personas">
        <label>PERSONAS</label>
        <select>
          <option>2 personas, 1 habitación</option>
        </select>
      </div>

      <div class="desglose">
        <div class="linea">
          <span>890x 4 semanas</span>
          <span>$3560</span>
        </div>
        <hr>
        <div class="linea total">
          <span>Total</span>
          <span>$3560</span>
        </div>
      </div>

      <button class="btn-reservar">Reservar</button>
    </div>
  </div>
</template>

<style scoped>
/* ESTA ES LA ESTRUCTURA ORIGINAL QUE QUERÍAS */
.contenedor-detalles {
  display: flex;
  justify-content: space-between;
  gap: 250px; 
  width: 100%; 
  margin: 190px 0 60px 0%;
  font-family: sans-serif;
  color:#113956;
}

.info-hotel {
  flex: 1;
  max-width: 50%;
}

.nombre-hotel { font-size: 32px; margin-bottom: 5px; font-weight: bold; }
.rating-ubicacion { margin-bottom: 25px; }
.estrellas { color: #ffda44; margin-right: 10px; }
.subtitulo { font-size: 24px; margin: 20px 0 10px 0; font-weight: bold; }
.descripcion { line-height: 1.6; color: #444; text-align: justify; }

/* AJUSTES DE SERVICIOS */
.servicios-grid { display: flex; gap: 20px; margin-top: 15px; }
.servicio { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.servicio svg { color: #2c537a; }
.subtitulo{
  color:#111e37;
}

/* CARD RESERVA */
.card-reserva {
  flex: 0 0 350px;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  height: fit-content;
  background-color: white;
}
.precio-noche .monto { font-size: 28px; font-weight: bold; }
.inputs-fecha { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
.campo label, .campo-personas label { display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #666; }
input, select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 13px; outline: none; }
.campo-personas { margin-top: 15px; }
.desglose { margin-top: 25px; }
.linea { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666; }
hr { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
.total { font-weight: bold; font-size: 18px; color: #113956; }
.btn-reservar { width: 100%; background-color: #113956; color: white; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 15px; transition: background 0.3s; }
.btn-reservar:hover { background-color: #1e3a56; }
</style>
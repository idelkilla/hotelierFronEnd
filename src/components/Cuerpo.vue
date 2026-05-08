<template>
  <div class="main-container">
    <div class="search-section-container">
      <div class="search-bar-content">
        <FormSearch
          :initial-destino="searchDestino"
          :initial-entrada="searchEntrada"
          :initial-salida="searchSalida"
          :initial-huespedes="habitaciones"
          compact
          @search="handleSearchUpdate"
        />
      </div>
    </div>

    <div class="main-content-layout">

     <div class="filters-column">
      <div class="filter-card-box map-box">
    <div ref="mapContainer" style="width:100%; height:180px; border-radius:8px; background-color: #f0f0f0;"></div>
    <p class="map-link" @click="verEnMapa">Ver en el mapa</p>
  </div>

  <!-- BUSCAR POR NOMBRE -->
  <div class="filter-card-box">
    <p class="filter-card-title">Busca por nombre</p>
    <div class="name-search-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
        fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="text"
        v-model="searchByName"
        placeholder="ej., Marriott"
        class="name-search-input"
      />
    </div> 
  </div>

 <div class="filter-card-box">
    <p class="filter-card-title">Rango de Precio</p>
    <div class="price-inputs-container">
      <div class="price-card">
        <span class="price-label">Mínimo</span>
        <div class="price-input-wrapper">
          <span class="currency">$</span>
          <input type="number" v-model="minPrice" placeholder="0" />
        </div>
      </div>
      <div class="price-card">
        <span class="price-label">Máximo</span>
        <div class="price-input-wrapper">
          <span class="currency">$</span>
          <input type="number" v-model="maxPrice" placeholder="0" />
        </div>
      </div>
    </div>
  </div>

  <div class="filter-card-box">
    <p class="filter-card-title">Tipo de alojamiento</p>
    <div v-for="tipo in tiposDisponibles" :key="tipo" class="filter-checkbox-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" :value="tipo" v-model="selectedTipos" />
        <span class="filter-checkbox-label">{{ tipo }}</span>
      </div>
    </div>
  </div>

  <div class="filter-card-box">
    <p class="filter-card-title">Filtros populares</p>
    <div v-for="servicio in serviciosDisponibles" :key="servicio" class="filter-checkbox-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" :value="servicio" v-model="selectedServicios" />
        <span class="filter-checkbox-label">{{ servicio }}</span>
      </div>
    </div>
  </div>


  <div class="filter-card-box">
    <p class="filter-card-title">Servicios</p>
    <div class="services-grid">
      <div class="service-card" :class="{ selected: isServicioSelected('Wifi') }" @click="toggleServicio('Wifi')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18l.01 0"/><path d="M9.172 15.172a4 4 0 0 1 5.656 0"/><path d="M6.343 12.343a8 8 0 0 1 11.314 0"/><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"/></svg>
        <span class="service-name">Wifi ({{ contarPorServicio('Wifi') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Alberca') }" @click="toggleServicio('Alberca')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1"/><path d="M15 12v-7.5a1.5 1.5 0 0 1 3 0"/><path d="M9 12v-7.5a1.5 1.5 0 0 0 -3 0"/><path d="M15 5l-6 0"/><path d="M9 10l6 0"/></svg>
        <span class="service-name">Alberca ({{ contarPorServicio('Alberca') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Aire acondicionado') }" @click="toggleServicio('Aire acondicionado')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 16a3 3 0 0 1 -3 3"/><path d="M16 16a3 3 0 0 0 3 3"/><path d="M12 16v4"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4"/><path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3"/></svg>
        <span class="service-name">Aire acond. ({{ contarPorServicio('Aire acondicionado') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Cocina') }" @click="toggleServicio('Cocina')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10"/><path d="M15 6v12"/><path d="M18 12h.01"/><path d="M6.5 10.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0"/><path d="M6.5 13.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0"/></svg>
        <span class="service-name">Cocina ({{ contarPorServicio('Cocina') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Spa') }" @click="toggleServicio('Spa')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 9a10 10 0 1 0 20 0"/><path d="M12 19a10 10 0 0 1 10 -10"/><path d="M2 9a10 10 0 0 1 10 10"/><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5"/><path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5"/></svg>
        <span class="service-name">Spa ({{ contarPorServicio('Spa') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Bar') }" @click="toggleServicio('Bar')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 21h8"/><path d="M12 15v6"/><path d="M5 5a7 2 0 1 0 14 0a7 2 0 1 0 -14 0"/><path d="M5 5v.388c0 .432 .126 .853 .362 1.206l5 7.509c.633 .951 1.88 1.183 2.785 .517c.191 -.141 .358 -.316 .491 -.517l5 -7.509c.236 -.353 .362 -.774 .362 -1.206v-.388"/></svg>
        <span class="service-name">Bar ({{ contarPorServicio('Bar') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Estacionamiento') }" @click="toggleServicio('Estacionamiento')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14"/><path d="M10 16v-8h2.667c.736 0 1.333 .895 1.333 2s-.597 2 -1.333 2h-2.667"/></svg>
        <span class="service-name">Parking ({{ contarPorServicio('Estacionamiento') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Restaurante') }" @click="toggleServicio('Restaurante')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3"/></svg>
        <span class="service-name">Restaurante ({{ contarPorServicio('Restaurante') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Lavadora') }" @click="toggleServicio('Lavadora')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14"/><path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M8 6h.01"/><path d="M11 6h.01"/><path d="M14 6h2"/><path d="M8 14c1.333 -.667 2.667 -.667 4 0c1.333 .667 2.667 .667 4 0"/></svg>
        <span class="service-name">Lavadora ({{ contarPorServicio('Lavadora') }})</span>
      </div>
      <div class="service-card" :class="{ selected: isServicioSelected('Mascotas') }" @click="toggleServicio('Mascotas')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="service-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538"/></svg>
        <span class="service-name">Mascotas ({{ contarPorServicio('Mascotas') }})</span>
      </div>
    </div>
  </div>

  <div class="filter-card-box">
    <p class="filter-card-title">Estrellas</p>
    <div class="star-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" id="star-5" v-model="selectedStars" value="5" />
        <label for="star-5" :class="['star-icons', 'clickable', { selected: selectedStars.includes('5') }]">
          <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="selectedStars.includes('5') ? '#113955' : '#FFD700'" :stroke="selectedStars.includes('5') ? '#113955' : '#FFD700'" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>
        </label>
      </div>
      <span class="filter-checkbox-count">{{ contarPorEstrellas(5) }}</span>
    </div>
    <div class="star-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" id="star-4" v-model="selectedStars" value="4" />
        <label for="star-4" :class="['star-icons', 'clickable', { selected: selectedStars.includes('4') }]">
          <svg v-for="i in 4" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="selectedStars.includes('4') ? '#113955' : '#FFD700'" :stroke="selectedStars.includes('4') ? '#113955' : '#FFD700'" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>
        </label>
      </div>
      <span class="filter-checkbox-count">{{ contarPorEstrellas(4) }}</span>
    </div>
    <div class="star-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" id="star-3" v-model="selectedStars" value="3" />
        <label for="star-3" :class="['star-icons', 'clickable', { selected: selectedStars.includes('3') }]">
          <svg v-for="i in 3" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="selectedStars.includes('3') ? '#113955' : '#FFD700'" :stroke="selectedStars.includes('3') ? '#113955' : '#FFD700'" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>
        </label>
      </div>
      <span class="filter-checkbox-count">{{ contarPorEstrellas(3) }}</span>
    </div>
    <div class="star-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" id="star-2" v-model="selectedStars" value="2" />
        <label for="star-2" :class="['star-icons', 'clickable', { selected: selectedStars.includes('2') }]">
          <svg v-for="i in 2" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="selectedStars.includes('2') ? '#113955' : '#FFD700'" :stroke="selectedStars.includes('2') ? '#113955' : '#FFD700'" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>
        </label>
      </div>
      <span class="filter-checkbox-count">{{ contarPorEstrellas(2) }}</span>
    </div>
    <div class="star-row">
      <div class="filter-checkbox-left">
        <input type="checkbox" id="star-1" v-model="selectedStars" value="1" />
        <label for="star-1" :class="['star-icons', 'clickable', { selected: selectedStars.includes('1') }]">
          <svg v-for="i in 1" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="selectedStars.includes('1') ? '#113955' : '#FFD700'" :stroke="selectedStars.includes('1') ? '#113955' : '#FFD700'" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>
        </label>
      </div>
      <span class="filter-checkbox-count">{{ contarPorEstrellas(1) }}</span>
    </div>
  </div>

</div>
      <!-- RESULTADOS -->
      <div class="listings-column">

        <!-- TABS -->
        <div class="accommodation-tabs">
          <button class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M22 17v-3h-20"/><path d="M2 8v9"/><path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5z"/></svg>
            Todos
          </button>
          <button class="tab" :class="{ active: activeTab === 'Hotel' }" @click="activeTab = 'Hotel'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/><path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/><path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/></svg>
            Hoteles
          </button>
          <button class="tab" :class="{ active: activeTab === 'Casa' }" @click="activeTab = 'Casa'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>
            Casa
          </button>
        </div>

        <!-- CHIPS (solo móvil ≤768px) -->
        <div class="mobile-filter-chips">
          <button class="chip-filter-btn chip-main" @click="abrirDrawer('todos')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
            Filtros
          </button>
          <button class="chip-filter-btn" :class="{ active: selectedTipos.length > 0 }" @click="abrirDrawer('tipo')">
            Tipo <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button class="chip-filter-btn" :class="{ active: minPrice || maxPrice }" @click="abrirDrawer('precio')">
            Precio <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button class="chip-filter-btn" :class="{ active: selectedServicios.length > 0 }" @click="abrirDrawer('servicios')">
            Servicios <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button class="chip-filter-btn" :class="{ active: selectedStars.length > 0 }" @click="abrirDrawer('estrellas')">
            Puntuación <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        <!-- DRAWER (teleport al body para evitar z-index issues) -->
        <teleport to="body">
          <transition name="drawer">
            <div v-if="drawerAbierto" class="filter-drawer-overlay" @click.self="cerrarDrawer">
              <div class="filter-drawer">
                <div class="filter-drawer-header">
                  <h3>{{ drawerTitulo }}</h3>
                  <button class="drawer-close-btn" @click="cerrarDrawer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="filter-drawer-body">

                  <template v-if="filtroActivo === 'todos'">
                    <div class="drawer-section">
                      <p class="drawer-section-title">Buscar por nombre</p>
                      <div class="name-search-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" v-model="searchByName" placeholder="ej., Marriott" class="name-search-input" />
                      </div>
                    </div>
                    <div class="drawer-section">
                      <p class="drawer-section-title">Rango de Precio</p>
                      <div class="price-inputs-container">
                        <div class="price-card"><span class="price-label">Mínimo</span><div class="price-input-wrapper"><span class="currency">$</span><input type="text" v-model="minPrice" placeholder="0" /></div></div>
                        <div class="price-card"><span class="price-label">Máximo</span><div class="price-input-wrapper"><span class="currency">$</span><input type="text" v-model="maxPrice" placeholder="0" /></div></div>
                      </div>
                    </div>
                    <div class="drawer-section">
                      <p class="drawer-section-title">Tipo de alojamiento</p>
                      <div v-for="tipo in tiposDisponibles" :key="tipo" class="filter-checkbox-row">
                        <div class="filter-checkbox-left"><input type="checkbox" :value="tipo" v-model="selectedTipos" /><span class="filter-checkbox-label">{{ tipo }}</span></div>
                      </div>
                    </div>
                    <div class="drawer-section">
                      <p class="drawer-section-title">Servicios populares</p>
                      <div v-for="servicio in serviciosDisponibles" :key="servicio" class="filter-checkbox-row">
                        <div class="filter-checkbox-left"><input type="checkbox" :value="servicio" v-model="selectedServicios" /><span class="filter-checkbox-label">{{ servicio }}</span></div>
                      </div>
                    </div>
                    <div class="drawer-section">
                      <p class="drawer-section-title">Puntuación</p>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="5" /><span class="star-icons"><svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span></div><span class="filter-checkbox-count">{{ contarPorCalificacion(9) }}</span></div>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="4" /><span class="star-icons"><svg v-for="i in 4" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span></div><span class="filter-checkbox-count">{{ contarPorCalificacion(7) }}</span></div>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="3" /><span class="star-icons"><svg v-for="i in 3" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span></div><span class="filter-checkbox-count">{{ contarPorCalificacion(5) }}</span></div>
                    </div>
                  </template>

                  <template v-else-if="filtroActivo === 'precio'">
                    <div class="drawer-section">
                      <p class="drawer-section-title">Rango de Precio</p>
                      <div class="price-inputs-container">
                        <div class="price-card"><span class="price-label">Mínimo</span><div class="price-input-wrapper"><span class="currency">$</span><input type="text" v-model="minPrice" placeholder="0" /></div></div>
                        <div class="price-card"><span class="price-label">Máximo</span><div class="price-input-wrapper"><span class="currency">$</span><input type="text" v-model="maxPrice" placeholder="0" /></div></div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="filtroActivo === 'tipo'">
                    <div class="drawer-section">
                      <p class="drawer-section-title">Tipo de alojamiento</p>
                      <div v-for="tipo in tiposDisponibles" :key="tipo" class="filter-checkbox-row">
                        <div class="filter-checkbox-left"><input type="checkbox" :value="tipo" v-model="selectedTipos" /><span class="filter-checkbox-label">{{ tipo }}</span></div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="filtroActivo === 'servicios'">
                    <div class="drawer-section">
                      <p class="drawer-section-title">Servicios</p>
                      <div v-for="servicio in serviciosDisponibles" :key="servicio" class="filter-checkbox-row">
                        <div class="filter-checkbox-left"><input type="checkbox" :value="servicio" v-model="selectedServicios" /><span class="filter-checkbox-label">{{ servicio }}</span></div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="filtroActivo === 'estrellas'">
                    <div class="drawer-section">
                      <p class="drawer-section-title">Puntuación</p>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="5" /><span class="star-icons"><svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span><span style="margin-left:8px">{{ contarPorCalificacion(9) }}</span></div></div>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="4" /><span class="star-icons"><svg v-for="i in 4" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span><span style="margin-left:8px">{{ contarPorCalificacion(7) }}</span></div></div>
                      <div class="star-row"><div class="filter-checkbox-left"><input type="checkbox" v-model="selectedStars" value="3" /><span class="star-icons"><svg v-for="i in 3" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg></span><span style="margin-left:8px">{{ contarPorCalificacion(5) }}</span></div></div>
                    </div>
                  </template>

                </div>
                <div class="filter-drawer-footer">
                  <button class="drawer-clear-btn" @click="limpiarFiltros">Limpiar todo</button>
                  <button class="drawer-apply-btn" @click="cerrarDrawer">Ver {{ filteredHoteles.length }} resultados</button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>

        <!-- RESULTADOS -->
        <div v-if="isLoading" class="estado-busqueda"><p>Buscando hospedajes...</p></div>
        <div v-else-if="errorMsg" class="estado-busqueda"><p style="color:#c00">{{ errorMsg }}</p></div>
        <div v-else-if="filteredHoteles.length === 0" class="estado-busqueda"><p>No se encontraron hospedajes para tu búsqueda.</p></div>

        <template v-else>
          <h2 class="encontrdos">{{ filteredHoteles.length }} hospedajes encontrados</h2>

          <div class="hotel-card" v-for="hotel in filteredHoteles" :key="hotel.id_servicio" @click="verDetalle(hotel)" style="cursor:pointer">
            <div class="card-image-placeholder slider-container">
              <button class="slider-arrow left" @click.stop="prevImg(hotel)">&#10094;</button>
              <template v-if="hotel.imagenes && hotel.imagenes.length > 0">
                <img :src="hotel.imagenes[hotel.currentImg]" :alt="hotel.hotel" class="hotel-img" />
              </template>
              <div v-else class="img-sin-foto"><span>Sin foto</span></div>
              <button class="wishlist-button" :class="{ 'is-active': hotel.isFavorite }" @click.stop="hotel.isFavorite = !hotel.isFavorite">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" class="heart-svg-fix"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>
              </button>
              <button class="slider-arrow right" @click.stop="nextImg(hotel)">&#10095;</button>
              <div class="slider-dots">
                <span v-for="(img, index) in hotel.imagenes" :key="index" :class="{ active: index === hotel.currentImg }"></span>
              </div>
            </div>

            <div class="card-details">
              <h3>{{ hotel.hotel }}</h3>
              <p class="subtitle">{{ hotel.ubicacion }}</p>
              <div class="amenities">
                <span v-for="amenity in hotel.amenidades.slice(0, 4)" :key="amenity" class="amenity-tag">{{ amenity }}</span>
                <span v-if="hotel.amenidades.length > 4" class="amenity-tag">+{{ hotel.amenidades.length - 4 }} más</span>
              </div>
              <div class="rating-info">
                <span class="rating" :style="!hotel.calificacion_promedio ? 'background:#ccc' : ''">{{ hotel.calificacion_promedio ?? '—' }}</span>
                <div class="rating-text-stack">
                  <span class="rating-status">{{ textoCalificacion(hotel.calificacion_promedio) }}</span>
                  <span class="reviews">{{ hotel.total_resenas ?? 0 }} opiniones</span>
                </div>
              </div>
            </div>

            <div class="card-pricing">
              <span class="price-per-night">${{ hotel.precio_min.toFixed(2) }} <small>por noche</small></span>
              <span class="total-price" v-if="noches > 0">${{ (hotel.precio_min * noches).toFixed(2) }} <small>en total</small></span>
              <p class="taxes-info">Total con impuestos y cargos incluidos</p>
            </div>
          </div>
        </template>

      </div><!-- fin listings-column -->

    </div><!-- fin main-content-layout -->
  </div><!-- fin main-container -->
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
const route = useRoute()
const router = useRouter()
// Buscador por nombre
const searchByName = ref('')
import { apiPost } from '../services/api'

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

// ── Parámetros de la URL ──────────────────────────────────────────────────────
const searchDestino = ref(route.query.destino || '')
const searchEntrada = ref(route.query.entrada || '')
const searchSalida = ref(route.query.salida || '')
const idUbicacion = ref(route.query.id_ubicacion || '')
const habitaciones = ref(
  route.query.huespedes ? JSON.parse(route.query.huespedes) : [{ adultos: 2, ninos: 0 }]
)

// Vigilamos los cambios en la URL para refrescar la búsqueda y sincronizar el formulario
watch(() => route.query, () => {
  ejecutarBusqueda()
}, { deep: true })

import FormSearch from './FormSearch.vue';

// ── Estado ────────────────────────────────────────────────────────────────────
const hoteles = ref([])
const isLoading = ref(false)
const errorMsg = ref('')
let ignorarWatch = false   // ← GUARD para evitar el bucle

const mapContainer = ref(null)

// ── Filtros ───────────────────────────────────────────────────────────────────
const activeTab = ref('all')
const minPrice = ref(null)
const maxPrice = ref(null)
const selectedStars = ref([])
const selectedServicios = ref([])
const selectedTipos = ref([])

// ── Computed ──────────────────────────────────────────────────────────────────
const resumenHuespedes = computed(() => {
  const total = habitaciones.value.reduce((s, h) => s + (h.adultos || 0) + (h.ninos || 0), 0)
  return `${total} persona(s), ${habitaciones.value.length} hab.`
})

const noches = computed(() => {
  if (!searchEntrada.value || !searchSalida.value) return 0
  return Math.max(
    0,
    Math.round((new Date(searchSalida.value) - new Date(searchEntrada.value)) / 86400000)
  )
})

const tiposDisponibles = computed(() =>
  [...new Set(hoteles.value.map(h => h.tipo_hospedaje).filter(Boolean))]
)

const serviciosDisponibles = computed(() => {
  const s = new Set()
  hoteles.value.forEach(h => (h.amenidades || []).forEach(a => s.add(a)))
  return [...s]
})

const filteredHoteles = computed(() => {
  let lista = hoteles.value

  // 1. Filtro por Nombre
  if (searchByName.value.trim()) {
    const term = searchByName.value.toLowerCase()
    lista = lista.filter(h => h.hotel.toLowerCase().includes(term))
  }

  // 2. Filtro por Tabs (Tipo de alojamiento principal)
  if (activeTab.value !== 'all') {
    lista = lista.filter(h => h.tipo_hospedaje === activeTab.value)
  }

  // 3. Filtro por Checkboxes de Tipo (Si hay seleccionados)
  if (selectedTipos.value.length > 0) {
    lista = lista.filter(h => selectedTipos.value.includes(h.tipo_hospedaje))
  }

  // 4. Filtro por Rango de Precio
  if (minPrice.value !== null && minPrice.value !== '') {
    lista = lista.filter(h => h.precio_min >= Number(minPrice.value))
  }
  if (maxPrice.value !== null && maxPrice.value !== '') {
    lista = lista.filter(h => h.precio_min <= Number(maxPrice.value))
  }

  // 5. Filtro por Estrellas (bucket exacto)
  if (selectedStars.value.length > 0) {
    lista = lista.filter(h => {
      if (!h.calificacion_promedio) return false
      const cal = parseFloat(h.calificacion_promedio)
      const estrellas = getStarBucket(cal)
      return estrellas !== null && selectedStars.value.includes(String(estrellas))
    })
  }

  // 6. Filtro por Servicios (AND logic)
  if (selectedServicios.value.length > 0) {
    lista = lista.filter(h =>
      selectedServicios.value.every(s =>
        (h.amenidades || []).some(a => a.toLowerCase().includes(s.toLowerCase()))
      )
    )
  }

  return lista
})

const sliderClass = computed(() =>
  activeTab.value !== 'all' ? 'is-hotels' : 'is-all'
)

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStarBucket(cal) {
  if (cal >= 9) return 5
  if (cal >= 8) return 4
  if (cal >= 7) return 3
  if (cal >= 6) return 2
  if (cal >= 0) return 1
  return null
}

function contarPorEstrellas(estrellas) {
  return hoteles.value.filter(h => {
    if (!h.calificacion_promedio) return false
    return getStarBucket(parseFloat(h.calificacion_promedio)) === Number(estrellas)
  }).length
}
function contarPorServicio(nombre) {
  return hoteles.value.filter(h =>
    (h.amenidades || []).some(a => a.toLowerCase().includes(nombre.toLowerCase()))
  ).length
}

function textoCalificacion(cal) {
  if (!cal) return 'Sin calificación'
  const n = parseFloat(cal)
  if (n >= 9) return 'Excepcional'
  if (n >= 8) return 'Muy bueno'
  if (n >= 7) return 'Bueno'
  return 'Aceptable'
}

function toggleServicio(servicio) {
  if (selectedServicios.value.includes(servicio)) {
    selectedServicios.value = selectedServicios.value.filter(s => s !== servicio)
  } else {
    selectedServicios.value.push(servicio)
  }
}

function isServicioSelected(servicio) {
  return selectedServicios.value.includes(servicio)
}

const nextImg = h => { h.currentImg = (h.currentImg + 1) % h.imagenes.length }
const prevImg = h => { h.currentImg = (h.currentImg - 1 + h.imagenes.length) % h.imagenes.length }


function verDetalle(hotel) {
  router.push({
    path: `/hospedaje/${hotel.id_servicio}`,
    query: {
      entrada: searchEntrada.value,
      salida: searchSalida.value,
      huespedes: JSON.stringify(habitaciones.value),
    },
  })
}
const filtrosAbiertos = ref(false)
// ── Backend ───────────────────────────────────────────────────────────────────
async function ejecutarBusqueda() {
  isLoading.value = true
  errorMsg.value = ''
  hoteles.value = []

  const destino = route.query.destino || ''
  const idUbicacionQuery = route.query.id_ubicacion || ''
  const fechaInicio = route.query.entrada || ''
  const fechaFin = route.query.salida || ''
  const habs = route.query.huespedes
    ? JSON.parse(route.query.huespedes)
    : [{ adultos: 2, ninos: 0 }]

  // Actualizar campos del buscador visual
  searchDestino.value = destino
  searchEntrada.value = fechaInicio
  searchSalida.value = fechaFin
  habitaciones.value = habs

  // Validación básica de fechas si están presentes
  if (fechaInicio && fechaFin && fechaFin !== 'FLEXIBLE') {
    const dIni = new Date(fechaInicio)
    const dFin = new Date(fechaFin)
    if (dFin <= dIni) {
      errorMsg.value = 'La fecha de salida debe ser posterior a la de entrada'
      isLoading.value = false
      return
    }
  }

  try {
    const data = await apiPost('/search/hospedaje', {
      destino: destino || '',
      id_ubicacion: idUbicacionQuery,
      fecha_inicio: fechaInicio || null,
      fecha_fin: (fechaFin && fechaFin !== 'FLEXIBLE') ? fechaFin : null,
      habitaciones: habs,
    })

    // Normalizar la respuesta: Algunos backends devuelven { data: [...] } o [...]
    const rawResults = Array.isArray(data) ? data : (data?.data || [])
    
    hoteles.value = rawResults.map(h => {
      // Normalizar claves de Mayúsculas (Postgres) a Minúsculas (Frontend)
      const normalized = {}
      Object.keys(h).forEach(key => {
        normalized[key.toLowerCase()] = h[key]
      })

      return {
        ...normalized,
        // Re-asignar ID si viene como id_servicio
        id_servicio: normalized.id_servicio || normalized.id,
        currentImg: 0,
        isFavorite: false,
        // Asegurar que amenidades sea un array
        amenidades: Array.isArray(normalized.amenidades) ? normalized.amenidades : [],
        // Procesar imágenes
        imagenes: Array.isArray(normalized.imagenes) && normalized.imagenes.length > 0 
          ? normalized.imagenes 
          : (normalized.imagen_portada ? [normalized.imagen_portada] : [])
      }
    })

  } catch (err) {
    console.error('ERROR FETCH:', err)
    errorMsg.value = `Error: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initMap()
  ejecutarBusqueda()
})

function initMap() {
  nextTick(() => {
    if (!mapContainer.value) return

    // Inicializamos el mapa con Leaflet centrado en Rep. Dominicana
    const map = L.map(mapContainer.value).setView([18.7357, -70.1627], 7)

    // Usamos el estilo 'Voyager' de CartoDB que se ve mucho mejor para viajes
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    // Forzamos el ajuste de tamaño para evitar que se vea cortado al cargar
    setTimeout(() => { map.invalidateSize() }, 200)
  })
}

function verEnMapa() {
  // Lógica para abrir mapa pantalla completa
  console.log("Abriendo mapa...")
}
// Estado del drawer
const drawerAbierto  = ref(false)
const filtroActivo   = ref('todos')

const drawerTitulos = {
  todos:     'Todos los filtros',
  precio:    'Precio',
  tipo:      'Tipo de alojamiento',
  servicios: 'Servicios',
  estrellas: 'Puntuación',
}
const drawerTitulo = computed(() => drawerTitulos[filtroActivo.value] || 'Filtros')

function abrirDrawer(tipo) {
  filtroActivo.value  = tipo
  drawerAbierto.value = true
  document.body.style.overflow = 'hidden'
}

function cerrarDrawer() {
  drawerAbierto.value = false
  document.body.style.overflow = ''
}

function limpiarFiltros() {
  minPrice.value         = null
  maxPrice.value         = null
  selectedStars.value    = []
  selectedServicios.value = []
  selectedTipos.value    = []
  searchByName.value     = ''
}
</script>

<style scoped src="../assets/css/cuerpo.css"></style>

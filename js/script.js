/* =========================================================
   CASA ANCESTRAL — App Logic
   SPA Navigation · Cart · Forms · Calendar · Reservations
   ========================================================= */

'use strict';

// ─── App State ────────────────────────────────────────────
const App = {
  cart: [],                    // Array of cart items
  currentUser: null,           // Logged in user data
  currentScreen: 'screen-splash',
  prevScreen: 'screen-home',
  reservation: {
    selectedDate: null,        // JS Date object
    guests: 4,
    selectedTime: '01:45 PM',
    turn: 'almuerzo',
  },
  calendarDate: new Date(2024, 9, 1),  // October 2024 initial
  selectedCalDay: 10,
  checkout: {
    delivery: 'domicilio',
    payMethod: 1,
  },
};

// ─── Menu Data ────────────────────────────────────────────
const MENU = {
  fuertes: [
    { id: 'cazuela_mani',        name: 'Cazuela de Maní',           price: 20,  img: 'cazuela_mani',    desc: 'Un abrazo de nuestra cocina tradicional: maní molido que da vida a un caldo generoso con carne de res, verduras y chuño.',             hero: 'fullwidth' },
    { id: 'crema_hongos',        name: 'Crema de Hongos Nativos',    price: 28,  img: 'picante_mixto',   desc: 'Los hongos orgánicos de Pisili Tarabuco se transforman en una crema delicada que rinde homenaje a los sabores del valle.',      hero: 'square' },
    { id: 'sullka_picada',       name: 'Sullka Picada',              price: 75,  img: 'chicharron_cerdo',desc: 'Carne de res, tripa, papas y mote reunidos en una preparación que conserva la esencia de las mesas populares.',               hero: 'square' },
    { id: 'chorizo_chuquis',     name: 'Chorizo Chuquisaqueño',      price: 50,  img: 'chorizo',         desc: 'El sabor inconfundible del chorizo artesanal, acompañado de pan casero y ensalada fresca, como dicta la tradición chuquisaqueña.', hero: 'fullwidth' },
    { id: 'charquekan',          name: 'Charquekan',                 price: 70,  img: 'anticucho',       desc: 'Charque de llama o res deshidratado al sol, acompañado de mote, chuño, huevo duro y queso fresco. Un clásico andino.',         hero: 'square' },
    { id: 'chicharron_cerdo',    name: 'Chicharrón de Cerdo',        price: 65,  img: 'chicharron_cerdo',desc: 'Cerdo dorado hasta alcanzar el punto perfecto, servido con mote, papa y escabeche en una combinación llena de identidad.',     hero: 'fullwidth' },
    { id: 'chicharron_mexic',    name: 'Chicharrón Mexicano',        price: 65,  img: 'chicharron_cerdo',desc: 'Una fusión audaz: chicharrón crujiente con salsa verde, cebolla morada, cilantro y chile. Identidad con sabor a aventura.',      hero: 'square' },
    { id: 'pasta_ckocko',        name: 'Pasta al Ckocko de Pollo',   price: 65,  img: 'picante_mixto',   desc: 'Pasta artesanal bañada en salsa de ckocko, maní tostado y pollo desmechado. Donde la tradición abraza la contemporaneidad.',    hero: 'square' },
    { id: 'pique_lobo',          name: 'Pique Lobo',                 price: 80,  img: 'chicharron_cerdo',desc: 'Carne, chorizo, papa y locoto en el famoso pique a lo macho de la cocina boliviana. Intenso, contundente e irresistible.',      hero: 'fullwidth' },
  ],
  picantes: [
    { id: 'mondongo',            name: 'Mondongo',                   price: 55,  img: 'picante_mixto',   desc: 'Estómago de cerdo en ají colorado, cocinado a fuego lento con mote y palillo. Sabor profundo de nuestra gastronomía.',         hero: 'square' },
    { id: 'picante_mixto',       name: 'Picante Mixto',              price: 80,  img: 'picante_mixto',   desc: 'La máxima expresión del picante boliviano: pollo y lengua de res en ají amarillo con pasta, papa y chuñofuti.',               hero: 'fullwidth' },
    { id: 'picante_lengua',      name: 'Picante de Lengua',          price: 80,  img: 'picante_mixto',   desc: 'Lengua de res tiernizada en salsa de ají amarillo y rojo, con tallarín artesanal. Una preparación que requiere paciencia.',    hero: 'square' },
    { id: 'picante_pollo',       name: 'Picante de Pollo',           price: 55,  img: 'cazuela_mani',    desc: 'Pollo al ají rojo acompañado de tallarín, papa y chuñofuti, una expresión del sabor intenso de la cocina boliviana.',          hero: 'square' },
  ],
  piqueos: [
    { id: 'anticucho',           name: 'Anticucho',                  price: 25,  img: 'anticucho',       desc: 'Corazón de res marinado en ají panca y comino, asado a las brasas. Servido con papa y llajua de maní.',                       hero: 'fullwidth' },
    { id: 'tripitas',            name: 'Tripitas',                   price: 25,  img: 'anticucho',       desc: 'Tripitas de res acompañadas de mote y papa, preparadas para quienes disfrutan de los sabores más arraigados de nuestra gastronomía.', hero: 'square' },
    { id: 'papas_nativas',       name: 'Papas Nativas',              price: 25,  img: 'chicharron_cerdo',desc: 'Papas nativas del altiplano boliviano, cocidas y servidas con llajua, queso fresco y kanamotera. Sencillez que enamora.',       hero: 'square' },
    { id: 'sandwich_charque',    name: 'Sandwich de Charque',        price: 25,  img: 'chorizo',         desc: 'Charque de llama desmechado, locoto, tomate y cebolla dentro de pan casero. El sandwich de los valles.',                        hero: 'square' },
    { id: 'salchipapita',        name: 'Salchipapita',               price: 25,  img: 'anticucho',       desc: 'Papas fritas artesanales con salchicha criolla, acompañadas de las salsas de la casa. Piqueo para compartir.',                 hero: 'square' },
    { id: 'pipoca_pollo',        name: 'Pipoca de Pollo',            price: 25,  img: 'chicharron_cerdo',desc: 'Pequeñas piezas de pollo empanizadas con especias locales, crujientes por fuera y jugosas por dentro. Irresistibles.',          hero: 'square' },
    { id: 'sandwich_veg',        name: 'Sandwich Vegetariano',       price: 30,  img: 'pan_campo',       desc: 'Hongos salteados y ensalada de maní dentro de pan casero, una alternativa que celebra los sabores naturales.',                  hero: 'square' },
    { id: 'ensalada_quinua',     name: 'Ensalada de Quinua',         price: 45,  img: 'pan_campo',       desc: 'Quinua real boliviana con vegetales de temporada, vinagreta de llajua y hierbas del jardín. Nutrición ancestral.',             hero: 'square' },
  ],
  postres: [
    { id: 'helado',              name: 'Helado',                     price: 18,  img: 'pan_campo',       desc: 'Helados artesanales elaborados con ingredientes locales: tuna, chirimoya y maracuyá. Frescura con identidad.',                  hero: 'square' },
    { id: 'afogatto',            name: 'Afogatto',                   price: 18,  img: 'pan_campo',       desc: 'Helado de crema de leche bañado en espresso doble. El encuentro perfecto entre lo frío y lo ardiente.',                         hero: 'square' },
  ],
  bebidas: [
    { id: 'soda_artesanal',      name: 'Soda Artesanal',             price: 15,  img: 'pan_campo',       desc: 'Gaseosas artesanales con sabores de frutas bolivianas: mocochinchi, tuna, maracuyá y chirimoya. Refrescantes y únicas.',        hero: 'square', special: false },
    { id: 'refresco_jarra',      name: 'Refresco Jarra',             price: 35,  img: 'cazuela_mani',    desc: 'Refrescos naturales servidos en jarra de barro: chicha de maní, mocochinchi, y api morado. Para compartir la mesa.',            hero: 'square', special: 'jarra' },
    { id: 'pan_campo_b',         name: 'Pan de Campo',               price: 8,   img: 'pan_campo',       desc: 'Masa madre de 48 horas, fermentada en frío y horneada a la leña. Perfecto para acompañar cualquier plato.',                    hero: 'fullwidth', special: false },
  ],
};

// Flat map of all dishes by id
const ALL_DISHES = {};
Object.values(MENU).forEach(cat => cat.forEach(d => { ALL_DISHES[d.id] = d; }));

// ─── Navigation System ────────────────────────────────────
window._prevScreen = 'screen-home';

function navigateTo(screenId, direction = 'forward') {
  const current = document.querySelector('.screen.active');
  const target  = document.getElementById(screenId);
  if (!target || !current || current.id === screenId) return;

  window._prevScreen = current.id;
  App.prevScreen = current.id;

  current.classList.remove('active');
  current.style.display = 'none';

  target.style.display = 'flex';
  target.classList.add('active');

  // Small delay so display:flex takes effect before animation reads layout
  requestAnimationFrame(() => {
    target.classList.add('slide-in');
    setTimeout(() => target.classList.remove('slide-in'), 300);
  });

  App.currentScreen = screenId;

  // Screen-specific init hooks
  if (screenId === 'screen-cart')       renderCart();
  if (screenId === 'screen-home')       updateCartBadge();
  if (screenId === 'screen-reservations') renderCalendar();
  if (screenId === 'screen-reservation-time') updateReservationSummary();
}

function goBack() {
  navigateTo(App.prevScreen || 'screen-home');
}

function setNavActive(name) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.nav-item[data-nav="${name}"]`);
  if (btn) btn.classList.add('active');
}

// Bottom nav click handling
document.getElementById('bottom-nav').addEventListener('click', e => {
  const item = e.target.closest('.nav-item[data-nav]');
  if (!item) return;
  const nav = item.dataset.nav;

  setNavActive(nav);

  const targets = {
    home:         'screen-home',
    menu:         'screen-menu',
    reservations: 'screen-reservations',
    cart:         'screen-cart',
  };
  if (targets[nav]) navigateTo(targets[nav]);
});

// ─── Splash Screen ────────────────────────────────────────
function initSplash() {
  // Show bottom nav only after splash
  document.getElementById('bottom-nav').style.display = 'none';

  setTimeout(() => {
    document.getElementById('bottom-nav').style.display = '';
    navigateTo('screen-welcome');
  }, 2400);
}

// ─── Menu Rendering ───────────────────────────────────────
function renderAllMenuSections() {
  Object.entries(MENU).forEach(([cat, items]) => {
    const container = document.getElementById(`menu-items-${cat}`);
    if (!container) return;
    container.innerHTML = items.map(item => menuItemCardHTML(item)).join('');
  });
}

function menuItemCardHTML(item) {
  const isJarra = item.special === 'jarra';
  return `
    <div class="menu-item-card" onclick="openDishDetail('${item.id}')" role="button" tabindex="0" aria-label="${item.name}, ${item.price} bolivianos">
      <div class="menu-item-card__header">
        <div class="menu-item-card__name">${item.name}</div>
        <div class="menu-item-card__price">${item.price} bs</div>
      </div>
      <div class="menu-item-card__desc">${item.desc.substring(0, 80)}${item.desc.length > 80 ? '...' : ''}</div>
      <div class="menu-item-card__footer">
        ${isJarra
          ? `<button class="btn-jarra" onclick="addToCart('${item.id}'); event.stopPropagation();">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
               Ordenar Jarra
             </button>`
          : `<button class="btn-icon-plus" onclick="addToCart('${item.id}'); event.stopPropagation();" aria-label="Agregar ${item.name} al carrito">
               <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             </button>`
        }
      </div>
    </div>`;
}

function switchMenuTab(tab) {
  document.querySelectorAll('.menu-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
    t.setAttribute('aria-selected', t.dataset.tab === tab);
  });
  document.querySelectorAll('.menu-section').forEach(s => {
    s.classList.toggle('active', s.id === `tab-${tab}`);
  });
}

function openMenuCategory(cat) {
  setNavActive('menu');
  navigateTo('screen-menu');
  setTimeout(() => switchMenuTab(cat), 50);
}

// ─── Dish Detail ──────────────────────────────────────────
function openDishDetail(id) {
  const dish = ALL_DISHES[id];
  if (!dish) return;

  const imgSrc = `assets/images/${dish.img}.png`;
  const isFullwidth = dish.hero === 'fullwidth';

  const heroHTML = isFullwidth
    ? `<img src="${imgSrc}" alt="${dish.name}" class="dish-detail__hero" onerror="this.style.background='#F5EFE6';this.style.minHeight='220px'">`
    : `<div class="dish-detail__hero-square">
         <img src="${imgSrc}" alt="${dish.name}" onerror="this.style.background='#F5EFE6'">
       </div>`;

  document.getElementById('dish-detail-content').innerHTML = `
    ${heroHTML}
    <div class="dish-detail__body">
      <h1 class="dish-detail__title">${dish.name}</h1>
      <div class="dish-detail__price">${dish.price} bs</div>
      <p class="dish-detail__desc">${dish.desc}</p>
    </div>
    <div class="dish-detail__actions">
      <button class="btn btn-primary btn-primary-full" onclick="addToCart('${dish.id}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        AGREGAR AL CARRITO
      </button>
      <button class="btn btn-outline btn-primary-full" onclick="setNavActive('reservations'); navigateTo('screen-reservations')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        RESERVA TU MESA
      </button>
    </div>
    <div class="bottom-spacer"></div>
  `;

  navigateTo('screen-dish-detail');
}

// ─── Cart System ──────────────────────────────────────────
function addToCart(id) {
  const dish = ALL_DISHES[id];
  if (!dish) return;

  const existing = App.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    App.cart.push({ ...dish, qty: 1 });
  }

  updateCartBadge();
  showToast(`✓ ${dish.name} agregado al carrito`);
  animateCartBadge();
}

function removeFromCart(id) {
  App.cart = App.cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = App.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  renderCart();
  updateCartBadge();
}

function clearCart() {
  App.cart = [];
  updateCartBadge();
}

function updateCartBadge() {
  const total = App.cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = total;
  badge.classList.toggle('visible', total > 0);
}

function animateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.style.transform = 'scale(1.4)';
  setTimeout(() => { badge.style.transform = ''; }, 200);
}

function getCartTotal() {
  const subtotal = App.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const envio    = App.cart.length > 0 ? 10 : 0;
  const tax      = +(subtotal * 0.1).toFixed(2);
  const total    = +(subtotal + envio + tax).toFixed(2);
  return { subtotal, envio, tax, total };
}

function renderCart() {
  const content = document.getElementById('cart-content');
  if (!content) return;

  if (App.cart.length === 0) {
    content.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛍</div>
        <h2 class="cart-empty__title">Tu carrito está vacío</h2>
        <p class="cart-empty__text">Agrega platos desde el menú para comenzar tu pedido.</p>
        <button class="btn btn-primary" onclick="setNavActive('menu'); navigateTo('screen-menu')">VER MENÚ</button>
      </div>
      <div class="bottom-spacer"></div>`;
    return;
  }

  const { subtotal, envio, total } = getCartTotal();
  const itemsHTML = App.cart.map(item => `
    <div class="cart-item">
      <img src="assets/images/${item.img}.png" alt="${item.name}" class="cart-item__img"
           onerror="this.style.background='#F5EFE6'">
      <div class="cart-item__info">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">bs ${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item__desc">${item.desc.substring(0, 50)}...</div>
        <div class="cart-item__controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Reducir cantidad">−</button>
          <span class="cart-item__qty" aria-label="Cantidad: ${item.qty}">Cant: ${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="Aumentar cantidad">+</button>
          <button class="qty-btn" onclick="removeFromCart('${item.id}')" aria-label="Eliminar ${item.name}" style="margin-left:auto;color:#E53E3E;">✕</button>
        </div>
      </div>
    </div>`).join('');

  content.innerHTML = `
    <div class="cart-summary-card">
      <h2 class="cart-summary-card__title">Resumen</h2>
      ${itemsHTML}
      <div class="cart-totals">
        <div class="cart-total-row">
          <span>Subtotal</span>
          <span>bs ${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-total-row">
          <span>Envío</span>
          <span>bs ${envio.toFixed(2)}</span>
        </div>
        <div class="cart-total-row total">
          <span>Total</span>
          <span>bs ${total.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-legal">Al confirmar aceptas los Términos de Servicio</div>
    </div>
    <div class="cart-pay-bar">
      <button class="btn btn-primary btn-primary-full" onclick="navigateTo('screen-checkout')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
        Pagar Ahora — bs ${total.toFixed(2)}
      </button>
    </div>
    <div class="bottom-spacer"></div>`;
}

// ─── Checkout ─────────────────────────────────────────────
function selectDelivery(type) {
  App.checkout.delivery = type;
  document.getElementById('delivery-domicilio').classList.toggle('active', type === 'domicilio');
  document.getElementById('delivery-local').classList.toggle('active', type === 'local');
  document.getElementById('delivery-domicilio').setAttribute('aria-pressed', type === 'domicilio');
  document.getElementById('delivery-local').setAttribute('aria-pressed', type === 'local');
}

function selectPayMethod(num) {
  App.checkout.payMethod = num;
  [1, 2].forEach(n => {
    const card = document.getElementById(`pay-card-${n}`);
    card.classList.toggle('selected', n === num);
    card.setAttribute('aria-pressed', n === num);
  });
  // Show/hide card form based on selection
  const form = document.getElementById('card-details-form');
  if (form) form.style.display = num === 1 ? '' : 'none';
}

function handleCheckoutConfirm() {
  // Simple validation
  if (App.checkout.payMethod === 1) {
    const holder = document.getElementById('card-holder').value.trim();
    const exp    = document.getElementById('card-exp').value.trim();
    const cvv    = document.getElementById('card-cvv').value.trim();
    if (!holder || !exp || !cvv) {
      showToast('Por favor completa los datos de tu tarjeta');
      return;
    }
  }

  navigateTo('screen-order-success');
}

// ─── Forms — Login ────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  let valid = true;

  if (!email || !email.includes('@')) {
    showError('login-email', 'login-email-err'); valid = false;
  } else hideError('login-email', 'login-email-err');

  if (!pass || pass.length < 4) {
    showError('login-pass', 'login-pass-err'); valid = false;
  } else hideError('login-pass', 'login-pass-err');

  if (!valid) return;

  // Simulate login
  App.currentUser = { name: email.split('@')[0].toUpperCase() };
  document.getElementById('welcome-name').textContent = App.currentUser.name;
  navigateTo('screen-welcome-user');
  setTimeout(() => { setNavActive('home'); navigateTo('screen-home'); }, 2200);
}

// ─── Forms — Register Step 1 ──────────────────────────────
function handleRegisterStep1(e) {
  e.preventDefault();
  const nombre   = document.getElementById('reg-nombre').value.trim();
  const apellido = document.getElementById('reg-apellido').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  let valid = true;

  if (!nombre)                        { showError('reg-nombre', 'reg-nombre-err');   valid = false; }
  else                                  hideError('reg-nombre', 'reg-nombre-err');

  if (!apellido)                      { showError('reg-apellido', 'reg-apellido-err'); valid = false; }
  else                                  hideError('reg-apellido', 'reg-apellido-err');

  if (!email || !email.includes('@')) { showError('reg-email', 'reg-email-err');     valid = false; }
  else                                  hideError('reg-email', 'reg-email-err');

  if (!valid) return;

  App.currentUser = { name: nombre.toUpperCase(), apellido };
  navigateTo('screen-register-2');
}

// ─── Forms — Register Step 2 ──────────────────────────────
function handleRegisterStep2(e) {
  e.preventDefault();
  const pass1 = document.getElementById('reg-pass1').value;
  const pass2 = document.getElementById('reg-pass2').value;
  let valid = true;

  if (!pass1 || pass1.length < 6) { showError('reg-pass1', 'reg-pass1-err'); valid = false; }
  else                               hideError('reg-pass1', 'reg-pass1-err');

  if (pass2 !== pass1)             { showError('reg-pass2', 'reg-pass2-err'); valid = false; }
  else                               hideError('reg-pass2', 'reg-pass2-err');

  if (!valid) return;

  document.getElementById('welcome-name').textContent = App.currentUser?.name || 'USUARIO';
  navigateTo('screen-welcome-user');
  setTimeout(() => { setNavActive('home'); navigateTo('screen-home'); }, 2200);
}

function showError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err)   err.classList.add('show');
}

function hideError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.remove('error');
  if (err)   err.classList.remove('show');
}

// ─── Calendar ─────────────────────────────────────────────
const MONTHS_ES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
const DAYS_ES   = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

function renderCalendar() {
  const d     = App.calendarDate;
  const year  = d.getFullYear();
  const month = d.getMonth();

  document.getElementById('calendar-month-label').textContent = `${MONTHS_ES[month]} ${year}`;

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const today     = new Date();

  let html = DAYS_ES.map(day => `<div class="calendar-grid__day-label">${day}</div>`).join('');

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div></div>';
  }

  for (let day = 1; day <= daysInMon; day++) {
    const date    = new Date(year, month, day);
    const isPast  = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSel   = App.selectedCalDay === day && year === d.getFullYear() && month === d.getMonth();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    let cls = 'calendar-day';
    if (isPast)  cls += ' disabled';
    if (isSel)   cls += ' selected';
    if (isToday && !isSel) cls += ' today';

    const disabled = isPast ? 'disabled aria-disabled="true"' : '';

    html += `<button class="${cls}" ${disabled} onclick="selectCalendarDay(${day}, ${year}, ${month})" aria-label="${day} de ${MONTHS_ES[month]}">${day}</button>`;
  }

  document.getElementById('calendar-grid').innerHTML = html;

  // Update reservation summary
  updateReservationSummary();
}

function selectCalendarDay(day, year, month) {
  App.selectedCalDay = day;
  App.calendarDate   = new Date(year, month, day);
  App.reservation.selectedDate = new Date(year, month, day);
  renderCalendar();
}

function changeMonth(delta) {
  const d = App.calendarDate;
  App.calendarDate = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  App.selectedCalDay = null;
  renderCalendar();
}

function changeGuests(delta) {
  App.reservation.guests = Math.max(1, Math.min(20, App.reservation.guests + delta));
  document.getElementById('guests-value').textContent = App.reservation.guests;
}

function goToTimeSelection() {
  if (!App.selectedCalDay) {
    showToast('Por favor selecciona una fecha');
    return;
  }
  updateReservationSummary();
  navigateTo('screen-reservation-time');
}

// ─── Time Selection ───────────────────────────────────────
function switchTimeTab(turn) {
  App.reservation.turn = turn;
  ['almuerzo','cena'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('active', t === turn);
    document.getElementById(`tab-${t}`).setAttribute('aria-selected', t === turn);
    const grid = document.getElementById(`time-slots-${t}`);
    if (grid) grid.classList.toggle('hidden', t !== turn);
  });
  App.reservation.selectedTime = null;
  updateReservationSummary();
}

function selectTimeSlot(btn, time) {
  const grid = btn.closest('.time-slots-grid');
  if (!grid) return;
  grid.querySelectorAll('.time-slot').forEach(s => {
    s.classList.remove('selected');
    s.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('selected');
  btn.setAttribute('aria-pressed', 'true');
  App.reservation.selectedTime = time;
  updateReservationSummary();
}

function updateReservationSummary() {
  const summaryEl = document.getElementById('reservation-summary-text');
  if (!summaryEl) return;

  const d = App.reservation.selectedDate || App.calendarDate;
  const dateStr = d
    ? `${d.getDate()} ${MONTHS_ES[d.getMonth()].substring(0,3)}`
    : '—';
  const time   = App.reservation.selectedTime || '—';
  const guests = App.reservation.guests;

  summaryEl.textContent = `${dateStr} • ${time} • ${guests} ${guests === 1 ? 'Persona' : 'Personas'}`;
}

function confirmReservation() {
  if (!App.reservation.selectedTime) {
    showToast('Por favor selecciona un horario');
    return;
  }

  const d = App.reservation.selectedDate || App.calendarDate;
  const dateStr = d ? `${d.getDate()} de ${MONTHS_ES[d.getMonth()]}` : '';
  const time    = App.reservation.selectedTime;
  const guests  = App.reservation.guests;

  const confirmText = document.getElementById('reservation-confirmed-text');
  if (confirmText) {
    confirmText.textContent = `Tu mesa para ${guests} ${guests === 1 ? 'persona' : 'personas'} el ${dateStr} a las ${time} ha sido reservada. ¡Te esperamos!`;
  }

  navigateTo('screen-reservation-success');
}

// ─── Toast Notification ───────────────────────────────────
let _toastTimer = null;
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

// ─── Keyboard accessibility ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const btn = document.activeElement;
    if (btn && btn.getAttribute('role') === 'button') {
      e.preventDefault();
      btn.click();
    }
  }
});

// Card input formatting
document.addEventListener('input', e => {
  const target = e.target;
  if (target.id === 'card-exp') {
    let v = target.value.replace(/\D/g, '');
    if (v.length >= 3) v = v.substring(0,2) + ' / ' + v.substring(2,4);
    target.value = v;
  }
  if (target.id === 'reg-dob') {
    let v = target.value.replace(/\D/g, '');
    if (v.length >= 5) v = v.substring(0,2) + '/' + v.substring(2,4) + '/' + v.substring(4,8);
    else if (v.length >= 3) v = v.substring(0,2) + '/' + v.substring(2);
    target.value = v;
  }
});

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Pre-render menu so it's ready
  renderAllMenuSections();

  // Set initial calendar to current month or Oct 2024 as design shows
  App.calendarDate    = new Date(2024, 9, 1);  // October 2024
  App.selectedCalDay  = 10;
  App.reservation.selectedDate = new Date(2024, 9, 10);

  // Start splash
  initSplash();
});

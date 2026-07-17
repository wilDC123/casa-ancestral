/* =========================================================
   CASA ANCESTRAL — App Logic  v2
   SPA Navigation · Cart · Forms · Calendar · Reservations
   ─────────────────────────────────────────────────────────
   Mejoras v2:
   · Sesión persistente con localStorage
   · Carrito persistente con localStorage
   · Splash salta si ya hay sesión activa
   · Nav oculta en pantallas de auth
   · Avatar con iniciales del usuario
   · Scroll reset al cambiar tab del menú
   · Validación de fecha de nacimiento
   ========================================================= */

'use strict';

/* ─── Constantes ──────────────────────────────────────────── */
// Pantallas donde la barra de navegación NO debe mostrarse
const AUTH_SCREENS = new Set([
  'screen-splash',
  'screen-welcome',
  'screen-login',
  'screen-register-1',
  'screen-register-2',
  'screen-welcome-user',
]);

/* ─── App State ───────────────────────────────────────────── */
const App = {
  cart: [],
  currentUser: null,
  currentScreen: 'screen-splash',
  prevScreen: 'screen-home',
  reservation: {
    selectedDate: null,
    guests: 4,
    selectedTime: '01:45 PM',
    turn: 'almuerzo',
  },
  calendarDate: new Date(2024, 9, 1),
  selectedCalDay: 10,
  checkout: {
    delivery: 'domicilio',
    payMethod: 1,
  },
};

/* ─── localStorage helpers ────────────────────────────────── */
function saveUser(user) {
  if (user) {
    localStorage.setItem('ancestral_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ancestral_user');
  }
}

function loadUser() {
  try {
    const raw = localStorage.getItem('ancestral_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveCart() {
  localStorage.setItem('ancestral_cart', JSON.stringify(App.cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem('ancestral_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/* ─── Menu Data ───────────────────────────────────────────── */
const MENU = {
  fuertes: [
    { id: 'cazuela_mani',      name: 'Cazuela de Maní',           price: 20,  img: 'cazuela_mani',        desc: 'Un abrazo de nuestra cocina tradicional: maní molido que da vida a un caldo generoso con carne de res, verduras y chuño.',              hero: 'fullwidth' },
    { id: 'crema_hongos',      name: 'Crema de Hongos Nativos',   price: 28,  img: 'crema_hongos',        desc: 'Los hongos orgánicos de Pisili Tarabuco se transforman en una crema delicada que rinde homenaje a los sabores del valle.',       hero: 'square' },
    { id: 'sullka_picada',     name: 'Sullka Picada',             price: 75,  img: 'sullka_picada',       desc: 'Carne de res, tripa, papas y mote reunidos en una preparación que conserva la esencia de las mesas populares.',                hero: 'square' },
    { id: 'chorizo_chuquis',   name: 'Chorizo Chuquisaqueño',     price: 50,  img: 'chorizo',             desc: 'El sabor inconfundible del chorizo artesanal, acompañado de pan casero y ensalada fresca, como dicta la tradición chuquisaqueña.', hero: 'fullwidth' },
    { id: 'charquekan',        name: 'Charquekan',                price: 70,  img: 'charquekan',          desc: 'Charque dorado y deshebrado sobre mote blanco, acompañado de papa cocida, queso fresco y huevo duro. El plato emblema de los valles bolivianos.',         hero: 'fullwidth' },
    { id: 'chicharron_cerdo',  name: 'Chicharrón de Cerdo',       price: 65,  img: 'chicharron_cerdo',    desc: 'Cerdo dorado hasta alcanzar el punto perfecto, servido con mote, papa y escabeche en una combinación llena de identidad.',      hero: 'fullwidth' },
    { id: 'chicharron_mexic',  name: 'Chicharrón Mexicano',       price: 65,  img: 'chicharron_mexic',    desc: 'Una fusión audaz: chicharrón crujiente con salsa verde, cebolla morada, cilantro y chile. Identidad con sabor a aventura.',       hero: 'square' },
    { id: 'pasta_ckocko',      name: 'Pasta al Ckocko de Pollo',  price: 65,  img: 'pasta_ckocko',        desc: 'Pasta artesanal bañada en salsa de ckocko, maní tostado y pollo desmechado. Donde la tradición abraza la contemporaneidad.',     hero: 'square' },
    { id: 'pique_lobo',        name: 'Pique Lobo',                price: 80,  img: 'pique_lobo',          desc: 'Carne, chorizo, papa y locoto en el famoso pique a lo macho de la cocina boliviana. Intenso, contundente e irresistible.',       hero: 'fullwidth' },
  ],
  picantes: [
    { id: 'mondongo',          name: 'Mondongo',                  price: 55,  img: 'mondongo',            desc: 'Estómago de cerdo en ají colorado, cocinado a fuego lento con mote y palillo. Sabor profundo de nuestra gastronomía.',          hero: 'square' },
    { id: 'picante_mixto',     name: 'Picante Mixto',             price: 80,  img: 'picantemixto',        desc: 'Pollo al ají y mondongo sobre mote, con charque deshebrado, salsa roja intensa, cebolla fresca y tomate. La máxima expresión del picante boliviano.',  hero: 'fullwidth' },
    { id: 'picante_lengua',    name: 'Picante de Lengua',         price: 80,  img: 'picante_lengua',      desc: 'Lengua de res tiernizada en salsa de ají amarillo y rojo, con tallarín artesanal. Una preparación que requiere paciencia.',     hero: 'square' },
    { id: 'picante_pollo',     name: 'Picante de Pollo',          price: 55,  img: 'picante_pollo',       desc: 'Pollo al ají rojo acompañado de tallarín, papa y chuñofuti, una expresión del sabor intenso de la cocina boliviana.',           hero: 'square' },
  ],
  piqueos: [
    { id: 'anticucho',         name: 'Anticucho',                 price: 25,  img: 'anticucho',           desc: 'Corazón de res marinado en ají panca y comino, asado a las brasas. Servido con papa y llajua de maní.',                        hero: 'fullwidth' },
    { id: 'tripitas',          name: 'Tripitas',                  price: 25,  img: 'tripitas',            desc: 'Tripas de res a la brasa, sazonadas con especias criollas, acompañadas de papa y cebolla morada encurtida. Sabor directo y sin rodeos.',  hero: 'fullwidth' },
    { id: 'papas_nativas',     name: 'Papas Nativas',             price: 25,  img: 'papas_nativas',       desc: 'Papas nativas del altiplano boliviano, cocidas y servidas con llajua, queso fresco y kanamotera. Sencillez que enamora.',        hero: 'square' },
    { id: 'sandwich_charque',  name: 'Sandwich de Charque',       price: 25,  img: 'sandwichdecharque',   desc: 'Carne deshebrada y jugosa con queso fundido dentro de pan artesanal dorado y crujiente, acompañado de su propio jugo. Contundente y sabroso.', hero: 'fullwidth' },
    { id: 'salchipapita',      name: 'Salchipapita',              price: 25,  img: 'salchipapita',        desc: 'Papas fritas artesanales con salchicha criolla, acompañadas de las salsas de la casa. Piqueo para compartir.',                  hero: 'square' },
    { id: 'pipoca_pollo',      name: 'Pipoca de Pollo',           price: 25,  img: 'pipocadepollo',       desc: 'Bocaditos de pollo empanizados con especias locales, dorados y crujientes por fuera, jugosos por dentro. Servidos con papas fritas y dos salsas de la casa.',  hero: 'fullwidth' },
    { id: 'sandwich_veg',      name: 'Sandwich Vegetariano',      price: 30,  img: 'sandwich_veg',        desc: 'Hongos salteados y ensalada de maní dentro de pan casero, una alternativa que celebra los sabores naturales.',                   hero: 'square' },
    { id: 'ensalada_quinua',   name: 'Ensalada de Quinua',        price: 45,  img: 'ensalada_quinua',     desc: 'Quinua real boliviana con vegetales de temporada, vinagreta de llajua y hierbas del jardín. Nutrición ancestral.',              hero: 'square' },
  ],
  postres: [
    { id: 'helado',            name: 'Helado',                    price: 18,  img: 'helado',              desc: 'Helados artesanales elaborados con ingredientes locales: tuna, chirimoya y maracuyá. Frescura con identidad.',                   hero: 'square' },
    { id: 'afogatto',          name: 'Afogatto',                  price: 18,  img: 'afogatto',            desc: 'Helado de crema suave en vaso de vidrio, bañado al momento con espresso doble caliente. El contraste perfecto entre lo frío y lo ardiente.',  hero: 'fullwidth' },
  ],
  bebidas: [
    { id: 'soda_artesanal',    name: 'Soda Artesanal',            price: 15,  img: 'sodaartesanal',       desc: 'Bebida artesanal rosada y refrescante con hielo y menta fresca, elaborada con fruta boliviana de temporada. Visualmente hermosa y deliciosa.',  hero: 'fullwidth', special: false },
    { id: 'refresco_jarra',    name: 'Refresco Jarra',            price: 35,  img: 'refresco_jarra',      desc: 'Refrescos naturales servidos en jarra de barro: chicha de maní, mocochinchi, y api morado. Para compartir la mesa.',             hero: 'square',    special: 'jarra' },
    { id: 'pan_campo_b',       name: 'Pan de Campo',              price: 8,   img: 'pan_campo',           desc: 'Masa madre de 48 horas, fermentada en frío y horneada a la leña. Perfecto para acompañar cualquier plato.',                     hero: 'fullwidth', special: false },
  ],
};

// Mapa plano de todos los platos por id
const ALL_DISHES = {};
Object.values(MENU).forEach(cat => cat.forEach(d => { ALL_DISHES[d.id] = d; }));

/* ─── Navigation ──────────────────────────────────────────── */
window._prevScreen = 'screen-home';

function navigateTo(screenId) {
  const current = document.querySelector('.screen.active');
  const target  = document.getElementById(screenId);
  if (!target || !current || current.id === screenId) return;

  window._prevScreen = current.id;
  App.prevScreen     = current.id;

  current.classList.remove('active');
  current.style.display = 'none';

  target.style.display = 'flex';
  target.classList.add('active');

  requestAnimationFrame(() => {
    target.classList.add('slide-in');
    setTimeout(() => target.classList.remove('slide-in'), 300);
  });

  App.currentScreen = screenId;

  // Control de visibilidad de la barra de navegación
  const nav = document.getElementById('bottom-nav');
  if (nav) {
    nav.style.display = AUTH_SCREENS.has(screenId) ? 'none' : '';
  }

  // Hooks de init por pantalla
  if (screenId === 'screen-cart')              renderCart();
  if (screenId === 'screen-home')              updateCartBadge();
  if (screenId === 'screen-reservations')      renderCalendar();
  if (screenId === 'screen-reservation-time')  updateReservationSummary();
}

function goBack() {
  navigateTo(App.prevScreen || 'screen-home');
}

/* ─── Sidebar Drawer ──────────────────────────────────────── */
function openSidebar() {
  document.getElementById('sidebar-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── Profile Bottom Sheet ────────────────────────────────── */
function openProfile() {
  // Poblar datos del usuario
  const name  = App.currentUser?.name  || 'Usuario';
  const email = App.currentUser?.email || '—';
  const initial = name[0]?.toUpperCase() || '?';

  const nameEl    = document.getElementById('profile-name');
  const emailEl   = document.getElementById('profile-email');
  const initialEl = document.getElementById('profile-avatar-initial');

  if (nameEl)    nameEl.textContent    = name;
  if (emailEl)   emailEl.textContent   = email;
  if (initialEl) initialEl.textContent = initial;

  document.getElementById('profile-sheet').classList.add('open');
  document.getElementById('sheet-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfile() {
  document.getElementById('profile-sheet').classList.remove('open');
  document.getElementById('sheet-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── Logout ──────────────────────────────────────────────── */
function handleLogout() {
  closeSidebar();
  closeProfile();
  // Limpiar sesión y carrito
  saveUser(null);
  App.currentUser = null;
  App.cart = [];
  saveCart();
  updateCartBadge();
  // Volver al splash/welcome
  showToast('Sesión cerrada correctamente');
  setTimeout(() => navigateTo('screen-welcome'), 800);
}

function setNavActive(name) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.nav-item[data-nav="${name}"]`);
  if (btn) btn.classList.add('active');
}

// Clicks en la barra de navegación inferior
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

/* ─── Avatar ──────────────────────────────────────────────── */
function updateHeaderAvatars() {
  const name    = App.currentUser?.name || '';
  const initial = name ? name[0].toUpperCase() : '?';

  document.querySelectorAll('.header__avatar').forEach(el => {
    // Si hay foto de usuario futura, aquí se pondría; por ahora iniciales
    const hasImg = el.querySelector('img');
    if (hasImg) {
      // Reemplazar la imagen con el span de inicial
      el.innerHTML = `<span class="avatar-initial">${initial}</span>`;
    }
  });
}

/* ─── Splash ──────────────────────────────────────────────── */
function initSplash() {
  // Ocultar nav siempre durante el splash
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none';

  const savedUser = loadUser();

  setTimeout(() => {
    if (savedUser) {
      // Ya hay sesión → saltar login y ir directo al Home
      App.currentUser = savedUser;
      updateHeaderAvatars();
      setNavActive('home');
      navigateTo('screen-home');
    } else {
      // Primera vez → flujo de auth
      navigateTo('screen-welcome');
    }
  }, 1800);
}

/* ─── Menu Rendering ──────────────────────────────────────── */
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

  // FIX #7: Resetear scroll al inicio de la sección al cambiar de tab
  const content = document.getElementById('menu-content');
  if (content) content.scrollTop = 0;
}

function openMenuCategory(cat) {
  setNavActive('menu');
  navigateTo('screen-menu');
  setTimeout(() => switchMenuTab(cat), 50);
}

/* ─── Dish Detail ─────────────────────────────────────────── */
function openDishDetail(id) {
  const dish = ALL_DISHES[id];
  if (!dish) return;

  const imgSrc      = `assets/images/${dish.img}.png`;
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

/* ─── Cart ────────────────────────────────────────────────── */
function addToCart(id) {
  const dish = ALL_DISHES[id];
  if (!dish) return;

  const existing = App.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    App.cart.push({ ...dish, qty: 1 });
  }

  saveCart();           // FIX #3: persistir en localStorage
  updateCartBadge();
  showToast(`✓ ${dish.name} agregado al carrito`);
  animateCartBadge();
}

function removeFromCart(id) {
  App.cart = App.cart.filter(i => i.id !== id);
  saveCart();
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
  saveCart();
  renderCart();
  updateCartBadge();
}

function clearCart() {
  App.cart = [];
  saveCart();
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

/* ─── Checkout ────────────────────────────────────────────── */
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
  const form = document.getElementById('card-details-form');
  if (form) form.style.display = num === 1 ? '' : 'none';
}

function handleCheckoutConfirm() {
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

/* ─── Forms — Login ───────────────────────────────────────── */
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

  App.currentUser = { name: email.split('@')[0].toUpperCase(), email };
  saveUser(App.currentUser);          // FIX #2: persistir sesión
  updateHeaderAvatars();

  document.getElementById('welcome-name').textContent = App.currentUser.name;
  navigateTo('screen-welcome-user');
  setTimeout(() => { setNavActive('home'); navigateTo('screen-home'); }, 2200);
}

/* ─── Forms — Register Step 1 ────────────────────────────── */
function handleRegisterStep1(e) {
  e.preventDefault();
  const nombre   = document.getElementById('reg-nombre').value.trim();
  const apellido = document.getElementById('reg-apellido').value.trim();
  const dob      = document.getElementById('reg-dob').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  let valid = true;

  if (!nombre)                        { showError('reg-nombre',   'reg-nombre-err');   valid = false; }
  else                                  hideError('reg-nombre',   'reg-nombre-err');

  if (!apellido)                      { showError('reg-apellido', 'reg-apellido-err'); valid = false; }
  else                                  hideError('reg-apellido', 'reg-apellido-err');

  // FIX #10: validar fecha de nacimiento
  if (!dob || dob.replace(/\D/g, '').length < 8) {
    showError('reg-dob', 'reg-dob-err'); valid = false;
  } else hideError('reg-dob', 'reg-dob-err');

  if (!email || !email.includes('@')) { showError('reg-email',    'reg-email-err');    valid = false; }
  else                                  hideError('reg-email',    'reg-email-err');

  if (!valid) return;

  App.currentUser = { name: nombre.toUpperCase(), apellido, email };
  navigateTo('screen-register-2');
}

/* ─── Forms — Register Step 2 ────────────────────────────── */
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

  saveUser(App.currentUser);          // FIX #2: persistir sesión tras registro
  updateHeaderAvatars();

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

/* ─── Calendar ────────────────────────────────────────────── */
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

  for (let i = 0; i < firstDay; i++) {
    html += '<div></div>';
  }

  for (let day = 1; day <= daysInMon; day++) {
    const date    = new Date(year, month, day);
    const isPast  = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSel   = App.selectedCalDay === day && year === d.getFullYear() && month === d.getMonth();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    let cls = 'calendar-day';
    if (isPast)            cls += ' disabled';
    if (isSel)             cls += ' selected';
    if (isToday && !isSel) cls += ' today';

    const disabled = isPast ? 'disabled aria-disabled="true"' : '';
    html += `<button class="${cls}" ${disabled} onclick="selectCalendarDay(${day}, ${year}, ${month})" aria-label="${day} de ${MONTHS_ES[month]}">${day}</button>`;
  }

  document.getElementById('calendar-grid').innerHTML = html;
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

/* ─── Time Selection ──────────────────────────────────────── */
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
  const dateStr = d ? `${d.getDate()} ${MONTHS_ES[d.getMonth()].substring(0, 3)}` : '—';
  const time    = App.reservation.selectedTime || '—';
  const guests  = App.reservation.guests;

  summaryEl.textContent = `${dateStr} • ${time} • ${guests} ${guests === 1 ? 'Persona' : 'Personas'}`;
}

function confirmReservation() {
  if (!App.reservation.selectedTime) {
    showToast('Por favor selecciona un horario');
    return;
  }

  const d       = App.reservation.selectedDate || App.calendarDate;
  const dateStr = d ? `${d.getDate()} de ${MONTHS_ES[d.getMonth()]}` : '';
  const time    = App.reservation.selectedTime;
  const guests  = App.reservation.guests;

  const confirmText = document.getElementById('reservation-confirmed-text');
  if (confirmText) {
    confirmText.textContent = `Tu mesa para ${guests} ${guests === 1 ? 'persona' : 'personas'} el ${dateStr} a las ${time} ha sido reservada. ¡Te esperamos!`;
  }

  navigateTo('screen-reservation-success');
}

/* ─── Toast ───────────────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ─── Keyboard accessibility ──────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeProfile();
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    const btn = document.activeElement;
    if (btn && btn.getAttribute('role') === 'button') {
      e.preventDefault();
      btn.click();
    }
  }
});

/* ─── Input formatting ────────────────────────────────────── */
document.addEventListener('input', e => {
  const target = e.target;
  if (target.id === 'card-exp') {
    let v = target.value.replace(/\D/g, '');
    if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
    target.value = v;
  }
  if (target.id === 'reg-dob') {
    let v = target.value.replace(/\D/g, '');
    if (v.length >= 5)      v = v.substring(0, 2) + '/' + v.substring(2, 4) + '/' + v.substring(4, 8);
    else if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
    target.value = v;
  }
});

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // FIX #3: Cargar carrito desde localStorage
  App.cart = loadCart();

  // Pre-renderizar menú
  renderAllMenuSections();

  // Fecha inicial del calendario (Octubre 2024 como en el diseño)
  App.calendarDate         = new Date(2024, 9, 1);
  App.selectedCalDay       = 10;
  App.reservation.selectedDate = new Date(2024, 9, 10);

  // FIX #4: Splash con detección de sesión
  initSplash();
});

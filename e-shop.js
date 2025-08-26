// ---------- Data ----------
const PRODUCTS = [
  {id:1, name:"Basic Tee", category:"Clothing", price:499, img:"https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"},
  {id:2, name:"Running Sneakers", category:"Footwear", price:999, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"},
  {id:3, name:"Leather Handbag", category:"Accessories", price:599, img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop"},
  {id:4, name:"Wireless Headphones", category:"Electronics", price:1499, img:"https://images.unsplash.com/photo-1518442317436-f963ff2ac87f?q=80&w=1200&auto=format&fit=crop"},
  {id:5, name:"Smart Watch", category:"Electronics", price:999, img:"https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200&auto=format&fit=crop"},
  {id:6, name:"Comfy Hoodie", category:"Clothing", price:1499, img:"https://images.unsplash.com/photo-1548883354-94bcfe321c2e?q=80&w=1200&auto=format&fit=crop"},
  {id:7, name:"Sunglasses", category:"Accessories", price:399, img:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop"},
  {id:8, name:"Trail Boots", category:"Footwear", price:799, img:"https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1200&auto=format&fit=crop"},
];

// ---------- Elements ----------
const body = document.body;
const grid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const overlay = document.getElementById('overlay');
const cartItemsEl = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const chipsWrap = document.getElementById('categoryChips');
const yearEl = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');

// ---------- State ----------
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let query = '';
let category = 'All';
let sort = 'featured';

// ---------- Theme ----------
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') body.classList.add('light');
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});

// ---------- Helpers ----------
const formatPrice = (p) => `₹${p.toFixed(2)}`;

function filteredProducts(){
  let arr = PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(query)
  );
  switch (sort){
    case 'price-asc': arr.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': arr.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': arr.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': arr.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: break;
  }
  return arr;
}

function renderChips(){
  const cats = ['All', ...new Set(PRODUCTS.map(p=>p.category))];
  chipsWrap.innerHTML = cats.map(c =>
    `<button class="chip ${c===category?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
}

// ---------- Render products ----------
function renderProducts(){
  const items = filteredProducts();
  grid.innerHTML = items.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="muted">${p.category}</p>
        <div class="row">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ---------- Cart logic ----------
function addToCart(id){
  const item = cart.find(i=>i.id===id);
  if (item) item.qty += 1;
  else {
    const product = PRODUCTS.find(p=>p.id===id);
    cart.push({ id, qty:1, name:product.name, price:product.price, img:product.img });
  }
  persist();
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i=>i.id!==id);
  persist();
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  persist();
  renderCart();
}

function persist(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart(){
  cartItemsEl.innerHTML = cart.length ? cart.map(i=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div>
        <div class="row"><strong>${i.name}</strong><span>${formatPrice(i.price)}</span></div>
        <div class="qty">
          <button data-act="dec" data-id="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-act="inc" data-id="${i.id}">+</button>
          <button class="icon-btn" style="margin-left:auto" data-act="del" data-id="${i.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('') : `<p class="muted">Your cart is empty.</p>`;

  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty, 0);
  cartSubtotalEl.textContent = formatPrice(subtotal);
  cartTotalEl.textContent = formatPrice(subtotal); // shipping free
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// ---------- Events ----------
document.addEventListener('click', (e)=>{
  // Add to cart
  const addBtn = e.target.closest('.add');
  if (addBtn){ addToCart(Number(addBtn.dataset.id)); }

  // Category chips
  const chip = e.target.closest('.chip');
  if (chip){
    category = chip.dataset.cat;
    renderChips();
    renderProducts();
  }

  // Cart qty / remove
  if (e.target.dataset.act){
    const id = Number(e.target.dataset.id);
    const act = e.target.dataset.act;
    if (act==='inc') changeQty(id, +1);
    if (act==='dec') changeQty(id, -1);
    if (act==='del') removeFromCart(id);
  }
});

// Search
searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  query = searchInput.value.trim().toLowerCase();
  renderProducts();
});

// Sort
sortSelect.addEventListener('change', ()=>{
  sort = sortSelect.value;
  renderProducts();
});

// Cart drawer
function openCart(){ cartDrawer.classList.add('open'); overlay.classList.add('show'); }
function closeCart(){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); }
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if (!cart.length) return alert('Your cart is empty.');
  alert('Demo checkout — your payment succuessful.');
});

// Init
renderChips();
renderProducts();
renderCart();
yearEl.textContent = new Date().getFullYear();

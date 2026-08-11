// ---------- Valley and Creeks Farm — Shop ----------
// This is a standalone app, separate from the farm's internal Ledger. It has no login and
// no access to the Ledger's business data — it only knows about the CATALOG below.
//
// HOW THIS STAYS CONNECTED TO THE LEDGER:
// The farm owner manages products in the Ledger's Products tab, then uses the
// "Publish to Shop app" button there to generate the CATALOG array below. That code gets
// pasted here (replacing this whole assignment) and pushed — that's the entire sync
// mechanism, since this site has no backend/database of its own.
const CATALOG = [];

const OWNER_WHATSAPP = "639757841228"; // 0975 784 1228 in international format, no + or leading 0
const OWNER_EMAIL = "pansensoyglenn150@gmail.com";
const ORDER_COUNTER_KEY = "shop-next-order-id";
const PAST_ORDERS_KEY = "shop-past-orders";

let cart = {}; // { productId: quantity }
let currentOrder = null;
let toastTimer = null;

function peso(n) {
  return "₱" + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(msg, type = 'info', duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast';
  if (type === 'error') t.classList.add('error');
  if (type === 'success') t.classList.add('success');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function plantationEmoji() {
  return "🌴";
}

// ---------- Product grid ----------
function renderProducts() {
  const grid = document.getElementById('shop-product-grid');
  const available = CATALOG.filter(p => p.active && p.stock > 0);
  if (available.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="glyph">🛒</span>Nothing available to order right now — check back soon.</div>`;
    return;
  }
  grid.innerHTML = available.map(p => {
    const qty = cart[p.id] || 0;
    return `
    <div class="product-card">
      ${p.photo ? `<img class="product-photo" src="${p.photo}" alt="${escapeHtml(p.name)}">` : `<div class="product-photo product-photo-placeholder">${plantationEmoji()}</div>`}
      <div class="product-name">${escapeHtml(p.name)}</div>
      ${p.description ? `<div class="product-desc">${escapeHtml(p.description)}</div>` : ''}
      <div class="product-price">${peso(p.price)} <span class="product-unit">/ ${p.unit}</span></div>
      <div class="product-stock">${p.stock} ${p.unit} available</div>
      <div class="qty-stepper">
        <button class="btn-ghost btn-sm" onclick="changeCartQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
        <span class="qty-value">${qty}</span>
        <button class="btn-ghost btn-sm" onclick="changeCartQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
    </div>`;
  }).join('');
}

function changeCartQty(productId, delta) {
  const p = CATALOG.find(x => x.id === productId);
  if (!p) return;
  const current = cart[productId] || 0;
  const next = Math.max(0, Math.min(p.stock, current + delta));
  if (next === 0) delete cart[productId];
  else cart[productId] = next;
  renderProducts();
  renderCart();
}

function cartTotal() {
  return round2(Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = CATALOG.find(x => x.id === parseInt(id, 10));
    return sum + (p ? p.price * qty : 0);
  }, 0));
}

function renderCart() {
  const itemsOut = document.getElementById('cart-items');
  const countLabel = document.getElementById('cart-count-label');
  const totalsStrip = document.getElementById('cart-totals-strip');
  const checkoutCard = document.getElementById('checkout-card');

  const entries = Object.entries(cart).map(([id, qty]) => ({ product: CATALOG.find(x => x.id === parseInt(id, 10)), qty }))
    .filter(e => e.product);
  const itemCount = entries.reduce((s, e) => s + e.qty, 0);
  countLabel.textContent = `(${itemCount} item${itemCount !== 1 ? 's' : ''})`;

  if (entries.length === 0) {
    itemsOut.innerHTML = `<div class="empty-state"><span class="glyph">🧺</span>Your cart is empty — add something above.</div>`;
    totalsStrip.style.display = 'none';
    checkoutCard.style.display = 'none';
    return;
  }

  itemsOut.innerHTML = `<div class="table-wrapper"><table>
    <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Subtotal</th><th></th></tr></thead>
    <tbody>
      ${entries.map(e => `
        <tr>
          <td>${escapeHtml(e.product.name)}</td>
          <td class="num">${e.qty} ${e.product.unit}</td>
          <td class="num">${peso(e.product.price)}</td>
          <td class="num">${peso(round2(e.product.price * e.qty))}</td>
          <td class="num"><button class="btn-danger btn-sm" onclick="changeCartQty(${e.product.id}, -${e.qty})">Remove</button></td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
  document.getElementById('cart-grand-total').textContent = peso(cartTotal());
  totalsStrip.style.display = '';
  checkoutCard.style.display = '';
}

// ---------- Checkout & receipt ----------
function nextOrderId() {
  const current = parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || '1', 10);
  localStorage.setItem(ORDER_COUNTER_KEY, String(current + 1));
  return current;
}

function formatOrderId(id) {
  return 'VC-' + String(id).padStart(5, '0');
}

function generateReceipt() {
  const entries = Object.entries(cart).map(([id, qty]) => ({ product: CATALOG.find(x => x.id === parseInt(id, 10)), qty }))
    .filter(e => e.product);
  if (entries.length === 0) {
    showToast('⚠️ Your cart is empty', 'error');
    return;
  }
  const name = document.getElementById('order-name').value.trim();
  const cellphone = document.getElementById('order-cellphone').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const notes = document.getElementById('order-notes').value.trim();

  if (!name) { showToast('⚠️ Enter your full name', 'error'); return; }
  if (!cellphone) { showToast('⚠️ Enter your mobile number', 'error'); return; }
  if (!address) { showToast('⚠️ Enter your delivery address', 'error'); return; }

  const order = {
    id: nextOrderId(),
    date: todayISO(),
    time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    customer_name: name,
    cellphone,
    address,
    notes,
    items: entries.map(e => ({ name: e.product.name, unit: e.product.unit, qty: e.qty, price: e.product.price })),
    total: cartTotal()
  };
  currentOrder = order;

  renderReceipt(order);
  savePastOrder(order);

  document.getElementById('checkout-card').style.display = 'none';
  document.getElementById('receipt-card').style.display = '';
  document.getElementById('receipt-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderReceipt(order) {
  const html = `
    <div class="receipt-print">
      <div class="header">
        <h3>🌿 Valley and Creeks Farm</h3>
        <p>Order Receipt</p>
        <p>${formatOrderId(order.id)} · ${order.date} ${order.time}</p>
      </div>
      <div class="line"></div>
      <div class="row"><span>Customer:</span><span><strong>${escapeHtml(order.customer_name)}</strong></span></div>
      <div class="row"><span>Mobile:</span><span>${escapeHtml(order.cellphone)}</span></div>
      <div class="row"><span>Address:</span><span>${escapeHtml(order.address)}</span></div>
      ${order.notes ? `<div class="row"><span>Notes:</span><span>${escapeHtml(order.notes)}</span></div>` : ''}
      <div class="line"></div>
      ${order.items.map(i => `<div class="row"><span>${escapeHtml(i.name)} × ${i.qty} ${i.unit}</span><span>${peso(round2(i.qty * i.price))}</span></div>`).join('')}
      <div class="line"></div>
      <div class="row total"><span>Total:</span><span>${peso(order.total)}</span></div>
      <div class="footer">
        <p>Payment &amp; delivery arranged directly with the farm.</p>
        <p>Not yet sent to the farm — use the buttons below.</p>
      </div>
    </div>`;
  document.getElementById('receipt-output').innerHTML = html;
}

function formatOrderMessage(order) {
  const lines = [
    `🌾 New order — Valley and Creeks Farm`,
    `Order ${formatOrderId(order.id)}`,
    ``,
    `Customer: ${order.customer_name}`,
    `Mobile: ${order.cellphone}`,
    `Address: ${order.address}`,
    order.notes ? `Notes: ${order.notes}` : null,
    ``,
    `Items:`,
    ...order.items.map(i => `- ${i.name}: ${i.qty} ${i.unit} × ${peso(i.price)} = ${peso(round2(i.qty * i.price))}`),
    ``,
    `Order total: ${peso(order.total)}`,
    `Date: ${order.date} ${order.time}`
  ].filter(Boolean);
  return lines.join('\n');
}

function sendOrder(method) {
  if (!currentOrder) {
    showToast('⚠️ Generate your receipt first', 'error');
    return;
  }
  const message = formatOrderMessage(currentOrder);
  if (method === 'email') {
    const subject = encodeURIComponent(`Order ${formatOrderId(currentOrder.id)} from ${currentOrder.customer_name}`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  } else {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${text}`, '_blank', 'noopener');
  }
  showToast(`✅ Check the ${method === 'email' ? 'email' : 'WhatsApp'} window to finish sending your order`, 'success', 5000);
}

function startNewOrder() {
  cart = {};
  currentOrder = null;
  document.getElementById('order-name').value = '';
  document.getElementById('order-cellphone').value = '';
  document.getElementById('order-address').value = '';
  document.getElementById('order-notes').value = '';
  document.getElementById('receipt-card').style.display = 'none';
  renderProducts();
  renderCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Past orders (this device only — a personal receipt history, not a farm-side log) ----------
function savePastOrder(order) {
  try {
    const list = JSON.parse(localStorage.getItem(PAST_ORDERS_KEY) || '[]');
    list.push(order);
    localStorage.setItem(PAST_ORDERS_KEY, JSON.stringify(list));
  } catch (e) { /* best-effort — a full receipt is already on screen either way */ }
  renderPastOrders();
}

function renderPastOrders() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(PAST_ORDERS_KEY) || '[]');
  } catch (e) { list = []; }
  const card = document.getElementById('past-orders-card');
  const out = document.getElementById('past-orders-list');
  if (list.length === 0) {
    card.style.display = 'none';
    return;
  }
  card.style.display = '';
  const sorted = [...list].sort((a, b) => b.id - a.id);
  out.innerHTML = `<div class="table-wrapper"><table>
    <thead><tr><th>Order</th><th>Date</th><th class="num">Items</th><th class="num">Total</th></tr></thead>
    <tbody>
      ${sorted.map(o => `
        <tr>
          <td>${formatOrderId(o.id)}</td>
          <td>${o.date} ${o.time || ''}</td>
          <td class="num">${o.items.reduce((s, i) => s + i.qty, 0)}</td>
          <td class="num">${peso(o.total)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  const updated = document.getElementById('catalog-updated-label');
  if (updated) updated.textContent = CATALOG.length === 0 ? '(catalog not published yet)' : '';
  renderProducts();
  renderCart();
  renderPastOrders();
});

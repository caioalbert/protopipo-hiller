const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const toast = document.getElementById('toast');
const searchInput = document.getElementById('searchInput');
const cards = [...document.querySelectorAll('.product-card')];
const filters = [...document.querySelectorAll('.filter-btn')];
const brands = [...document.querySelectorAll('.brand-card')];
const state = { category: 'all', brand: '', term: '' };
const selection = new Map();
const money = cents => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const catalog = new Map(cards.map(card => [card.dataset.name, {
  price: Number(card.querySelector('.product-bottom strong').textContent.replace(/[^\d,]/g, '').replace(',', '')),
  image: card.querySelector('.product-visual img').getAttribute('src')
}]));
const cartValue = () => [...selection].reduce((total, [name, quantity]) => total + catalog.get(name).price * quantity, 0);
let paymentPending = false;
let orderNumber = 0;
let lastOrder = null;
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function setMenu(open) {
  mainNav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuBtn.addEventListener('click', () => setMenu(!mainNav.classList.contains('open')));
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function applyFilters() {
  let count = 0;
  cards.forEach(card => {
    const visible = (state.category === 'all' || card.dataset.category === state.category)
      && (!state.brand || card.dataset.brand === state.brand)
      && normalize(card.dataset.name + ' ' + card.textContent).includes(normalize(state.term));
    card.classList.toggle('hidden', !visible);
    if (visible) count++;
  });
  filters.forEach(button => {
    const active = button.dataset.filter === state.category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  brands.forEach(button => {
    const active = button.dataset.brand === state.brand;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.getElementById('resultsCount').textContent = `${count} ${count === 1 ? 'produto encontrado' : 'produtos encontrados'}${state.brand ? ' · ' + state.brand : ''}`;
  document.getElementById('emptyState').hidden = count > 0;
  document.getElementById('clearFilters').hidden = state.category === 'all' && !state.brand && !state.term;
}
function resetFilters() {
  Object.assign(state, { category: 'all', brand: '', term: '' });
  searchInput.value = '';
  applyFilters();
}
function goToProducts() { document.getElementById('featured').scrollIntoView({ behavior: 'smooth' }); }
filters.forEach(button => button.addEventListener('click', () => { state.category = button.dataset.filter; applyFilters(); }));
brands.forEach(button => button.addEventListener('click', () => {
  state.brand = state.brand === button.dataset.brand ? '' : button.dataset.brand;
  applyFilters();
  goToProducts();
}));
document.querySelectorAll('[data-category-filter]').forEach(link => link.addEventListener('click', () => {
  state.category = link.dataset.categoryFilter;
  state.brand = '';
  state.term = '';
  searchInput.value = '';
  applyFilters();
}));
document.querySelectorAll('[data-reset-filters]').forEach(link => link.addEventListener('click', resetFilters));
document.getElementById('clearFilters').addEventListener('click', resetFilters);
function runSearch() { state.term = searchInput.value.trim(); applyFilters(); goToProducts(); }
document.getElementById('searchBtn').addEventListener('click', runSearch);
searchInput.addEventListener('input', () => { state.term = searchInput.value.trim(); applyFilters(); });
searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') runSearch(); });

const dialog = document.getElementById('cartDialog');
const cartButton = document.querySelector('.cart-button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateToCart(card, button) {
  const arrive = () => {
    if (!reducedMotion.matches) {
      cartButton.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)', backgroundColor: '#caa25f' },
        { transform: 'scale(1)' }
      ], { duration: 420, easing: 'ease-out' });
      document.getElementById('cartCount').animate([
        { transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }
      ], { duration: 420, easing: 'ease-out' });
    }
    showToast(`${card.dataset.name} adicionado ao carrinho.`);
  };
  if (reducedMotion.matches) { arrive(); return; }

  const image = card.querySelector('.product-visual img');
  const imageRect = image.getBoundingClientRect();
  const target = cartButton.getBoundingClientRect();
  // If the photograph has scrolled out of view, launch from the clicked button.
  const origin = imageRect.bottom > target.bottom && imageRect.top < window.innerHeight
    ? imageRect : button.getBoundingClientRect();
  const size = Math.min(110, origin.width);
  const startX = origin.left + origin.width / 2 - size / 2;
  const startY = Math.max(target.bottom + 12, Math.min(window.innerHeight - size, origin.top + origin.height / 2 - size / 2));
  const dx = target.left + target.width / 2 - (startX + size / 2);
  const dy = target.top + target.height / 2 - (startY + size / 2);
  const flyer = document.createElement('img');
  flyer.src = image.currentSrc || image.src;
  flyer.alt = '';
  flyer.setAttribute('aria-hidden', 'true');
  flyer.className = 'cart-flyer';
  Object.assign(flyer.style, { left: `${startX}px`, top: `${startY}px`, width: `${size}px`, height: `${size}px` });
  document.body.append(flyer);
  const frames = Array.from({ length: 21 }, (_, index) => {
    const t = index / 20;
    const arc = Math.sin(Math.PI * t) * Math.min(120, Math.abs(dx) * 0.2 + 40);
    // Account for center-based scaling so the curved path stays inside the viewport.
    const y = Math.max(8 - startY - size * t * 0.45, dy * t - arc);
    return {
      offset: t,
      transform: `translate(${dx * t}px, ${y}px) scale(${1 - t * 0.9}) rotate(${t * 12}deg)`,
      opacity: t < 0.85 ? 1 : (1 - t) / 0.15
    };
  });
  const flight = flyer.animate(frames, { duration: 800, easing: 'cubic-bezier(.3,.05,.65,1)', fill: 'forwards' });
  flight.finished.then(arrive).catch(() => {}).finally(() => flyer.remove());
}

function renderSelection() {
  const list = document.getElementById('cartItems');
  list.replaceChildren();
  let total = 0;
  selection.forEach((quantity, name) => {
    total += quantity;
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.className = 'cart-item-copy';
    const title = document.createElement('strong');
    title.textContent = name;
    const price = document.createElement('small');
    price.textContent = `${money(catalog.get(name).price)} por unidade`;
    label.append(title, price);
    const image = document.createElement('img');
    image.src = catalog.get(name).image;
    image.alt = '';
    image.className = 'cart-thumbnail';
    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    const minus = document.createElement('button');
    minus.textContent = '−';
    minus.setAttribute('aria-label', `Diminuir quantidade de ${name}`);
    const count = document.createElement('span');
    count.textContent = quantity;
    const plus = document.createElement('button');
    plus.textContent = '+';
    plus.setAttribute('aria-label', `Aumentar quantidade de ${name}`);
    minus.addEventListener('click', () => {
      if (quantity === 1) selection.delete(name); else selection.set(name, quantity - 1);
      renderSelection();
    });
    plus.addEventListener('click', () => { selection.set(name, quantity + 1); renderSelection(); });
    controls.append(minus, count, plus);
    const remove = document.createElement('button');
    remove.textContent = 'Remover';
    remove.setAttribute('aria-label', `Remover ${name} do carrinho`);
    remove.addEventListener('click', () => { selection.delete(name); renderSelection(); });
    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';
    const subtotal = document.createElement('strong');
    subtotal.textContent = money(catalog.get(name).price * quantity);
    actions.append(subtotal, controls, remove);
    item.append(image, label, actions);
    list.append(item);
  });
  if (!total) { const item = document.createElement('li'); item.textContent = 'Seu carrinho está vazio. Explore os produtos do catálogo.'; list.append(item); }
  document.getElementById('cartCount').textContent = total;
  document.getElementById('clearCart').hidden = !total;
  document.getElementById('cartTotal').textContent = money(cartValue());
  document.getElementById('checkoutBtn').disabled = !total;
}
document.querySelectorAll('.add-btn[aria-label]').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product-card');
  const name = card.dataset.name;
  selection.set(name, (selection.get(name) || 0) + 1);
  renderSelection();
  const label = button.querySelector('.add-label');
  label.textContent = 'Adicionado!';
  button.classList.add('is-added');
  clearTimeout(button.feedbackTimer);
  button.feedbackTimer = setTimeout(() => {
    label.textContent = 'Adicionar ao carrinho';
    button.classList.remove('is-added');
  }, 1300);
  animateToCart(card, button);
}));
function showCartStep(step) {
  for (const id of ['cartView', 'checkoutView', 'successView']) document.getElementById(id).hidden = id !== step;
  document.getElementById('cartTitle').textContent = { cartView: 'Seu carrinho', checkoutView: 'Pagamento', successView: 'Compra confirmada' }[step];
  dialog.scrollTop = 0;
  document.getElementById('cartTitle').focus();
}
cartButton.addEventListener('click', () => { renderSelection(); dialog.showModal(); showCartStep('cartView'); });
document.getElementById('closeCart').addEventListener('click', () => { if (!paymentPending) dialog.close(); });
dialog.addEventListener('cancel', event => { if (paymentPending) event.preventDefault(); });
document.getElementById('clearCart').addEventListener('click', () => { selection.clear(); renderSelection(); });

const paymentForm = document.getElementById('paymentForm');
const payButton = document.getElementById('payBtn');
const paymentStatus = document.getElementById('paymentStatus');
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!selection.size) return;
  paymentForm.reset();
  payButton.disabled = true;
  payButton.textContent = 'Pagar';
  paymentStatus.textContent = 'Escolha uma forma de pagamento para continuar.';
  const summary = document.getElementById('checkoutSummary');
  summary.replaceChildren();
  selection.forEach((quantity, name) => {
    const row = document.createElement('p');
    const label = document.createElement('span');
    label.textContent = `${quantity} × ${name}`;
    const value = document.createElement('strong');
    value.textContent = money(catalog.get(name).price * quantity);
    row.append(label, value);
    summary.append(row);
  });
  document.getElementById('paymentTotal').textContent = money(cartValue());
  showCartStep('checkoutView');
});
paymentForm.addEventListener('change', () => {
  const method = paymentForm.querySelector('input:checked');
  payButton.disabled = !method || paymentPending;
  paymentStatus.textContent = method ? `${method.value} selecionado. Clique em Pagar para simular a compra.` : 'Escolha uma forma de pagamento para continuar.';
});
document.getElementById('backToCart').addEventListener('click', () => { if (!paymentPending) showCartStep('cartView'); });
paymentForm.addEventListener('submit', event => {
  event.preventDefault();
  const method = paymentForm.querySelector('input:checked');
  if (paymentPending || !selection.size || !method) return;
  paymentPending = true;
  const order = { number: ++orderNumber, method: method.value, total: cartValue(), items: [...selection] };
  payButton.disabled = true;
  payButton.textContent = 'Processando pagamento…';
  paymentForm.setAttribute('aria-busy', 'true');
  paymentForm.querySelector('fieldset').disabled = true;
  document.getElementById('closeCart').disabled = true;
  document.getElementById('backToCart').disabled = true;
  paymentStatus.textContent = 'Aguarde um instante. Estamos simulando a confirmação do pagamento.';
  setTimeout(() => {
    lastOrder = order;
    selection.clear();
    renderSelection();
    const receipt = document.getElementById('orderReceipt');
    receipt.replaceChildren();
    for (const [label, value] of [
      ['Pedido demonstrativo', `DEMO-${String(lastOrder.number).padStart(4, '0')}`],
      ['Forma de pagamento', lastOrder.method],
      ['Produtos', `${lastOrder.items.reduce((total, [, quantity]) => total + quantity, 0)} unidades`],
      ['Total pago', money(lastOrder.total)]
    ]) {
      const row = document.createElement('p');
      const key = document.createElement('span'); key.textContent = label;
      const content = document.createElement('strong'); content.textContent = value;
      row.append(key, content); receipt.append(row);
    }
    paymentPending = false;
    paymentForm.removeAttribute('aria-busy');
    paymentForm.querySelector('fieldset').disabled = false;
    document.getElementById('closeCart').disabled = false;
    document.getElementById('backToCart').disabled = false;
    showCartStep('successView');
    showToast('Recebemos seu pagamento! Compra demonstrativa concluída.');
  }, 1400);
});
document.getElementById('continueShopping').addEventListener('click', () => dialog.close());
document.querySelector('[aria-label="Conta"]').addEventListener('click', () => showToast('Área do cliente em breve. Este protótipo apresenta o catálogo.'));
document.getElementById('newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('newsletterMsg').textContent = 'Demonstração concluída. Nenhum e-mail foi enviado ou armazenado.';
  event.target.reset();
  showToast('Cadastro demonstrativo concluído.');
});
applyFilters();

// One header shared by every static page in the prototype.
const headerScript = document.currentScript;
const homePage = document.getElementById('top') !== null || location.pathname.endsWith('/index.html') || location.pathname.endsWith('/');
const currentPage = location.pathname.split('/').pop() || 'index.html';
const navigation = [
  ['categorias.html', 'Categorias'],
  ['marcas.html', 'Marcas'],
  ['destaques.html', 'Destaques'],
  ['atacado.html', 'Atacado'],
  ['institucional.html', 'Institucional']
];
headerScript.insertAdjacentHTML('beforebegin', `
  <header class="site-header" id="top">
    <div class="container nav-wrap">
      <a href="index.html" class="brand" aria-label="R. Araújo Distribuidora — início">
        <img class="brand-logo" src="assets/logo-ra-araujo.webp" width="56" height="62" alt="" />
        <span><strong>R. ARAÚJO</strong><small>DISTRIBUIDORA</small></span>
      </a>
      <div class="search-wrap" role="search">
        <input id="searchInput" type="search" placeholder="O que sua empresa precisa hoje?" aria-label="Buscar produtos" />
        <button id="searchBtn" type="button" aria-label="Buscar"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg></button>
      </div>
      <nav class="main-nav" id="mainNav" aria-label="Navegação principal">
        ${navigation.map(([href, label]) => `<a href="${href}"${currentPage === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <div class="nav-actions">
        <button class="ghost-icon cart-button" type="button" aria-label="Abrir carrinho">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h2l3 12h11l3-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg> <span id="cartCount">0</span>
        </button>
        <button class="menu-btn" id="menuBtn" type="button" aria-label="Abrir menu" aria-controls="mainNav" aria-expanded="false"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      </div>
    </div>
  </header>`);
headerScript.remove();

const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
function setMenu(open) {
  mainNav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuBtn.addEventListener('click', () => setMenu(!mainNav.classList.contains('open')));
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

if (!homePage) {
  const searchInput = document.getElementById('searchInput');
  const search = () => {
    const query = searchInput.value.trim();
    location.href = query ? `index.html?busca=${encodeURIComponent(query)}#featured` : 'index.html#featured';
  };
  document.getElementById('searchBtn').addEventListener('click', search);
  searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') search(); });
  document.querySelector('.cart-button').addEventListener('click', () => { location.href = 'index.html?carrinho=1'; });
}

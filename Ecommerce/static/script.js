document.addEventListener('DOMContentLoaded', () => {

  /* ---------- theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '☀' : '☾';

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('dashboard-theme', next);
    themeToggle.querySelector('.theme-icon').textContent = next === 'dark' ? '☀' : '☾';
    updateChartColors();
  });

  /* ---------- active nav highlighting on scroll ---------- */
  const navItems = document.querySelectorAll('[data-nav]');
  const sections = ['overview', 'by-state', 'by-category', 'top-products']
    .map(id => document.getElementById(id));

  window.addEventListener('scroll', () => {
    let current = sections[0].id;
    sections.forEach(section => {
      if (window.scrollY + 120 >= section.offsetTop) current = section.id;
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* ---------- helpers ---------- */
  const fmtCurrency = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const fmtNumber = (n) => Number(n).toLocaleString('en-IN');

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  let stateChart, categoryChart;
  let totalRevenue = 0, totalOrders = 0;

  function updateChartColors() {
    const gridColor = cssVar('--border');
    const textColor = cssVar('--text-muted');
    [stateChart, categoryChart].forEach(chart => {
      if (!chart) return;
      if (chart.options.scales) {
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.y.ticks.color = textColor;
      }
      if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      chart.update();
    });
  }

  /* ---------- KPI cards ---------- */
  fetch('/api/total-revenue')
    .then(r => r.json())
    .then(data => {
      totalRevenue = data.total_revenue;
      document.getElementById('kpiRevenue').textContent = fmtCurrency(totalRevenue);
      maybeRenderAov();
    });

  fetch('/api/total-orders')
    .then(r => r.json())
    .then(data => {
      totalOrders = data.total_orders;
      document.getElementById('kpiOrders').textContent = fmtNumber(totalOrders);
      maybeRenderAov();
    });

  function maybeRenderAov() {
    if (totalRevenue && totalOrders) {
      document.getElementById('kpiAov').textContent = fmtCurrency(totalRevenue / totalOrders);
    }
  }

  /* ---------- revenue by state (bar chart) ---------- */
  fetch('/api/revenue-by-state')
    .then(r => r.json())
    .then(data => {
      const top10 = data.revenue_by_state.slice(0, 10);
      const ctx = document.getElementById('stateChart').getContext('2d');
      stateChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top10.map(d => d.state),
          datasets: [{
            label: 'Revenue',
            data: top10.map(d => d.revenue),
            backgroundColor: cssVar('--primary'),
            borderRadius: 4,
            maxBarThickness: 28
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: cssVar('--text-muted'), font: { size: 11 } } },
            y: { grid: { color: cssVar('--border') }, ticks: { color: cssVar('--text-muted'), font: { size: 11 } } }
          }
        }
      });
    });

  /* ---------- revenue by category (donut chart) ---------- */
  fetch('/api/revenue-by-category')
    .then(r => r.json())
    .then(data => {
      const rows = data.revenue_by_category;
      const palette = [cssVar('--primary'), cssVar('--gold'), cssVar('--teal'), '#8B98F0', '#C98A34', '#2E9E98', '#9AA0B4'];
      const ctx = document.getElementById('categoryChart').getContext('2d');
      categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: rows.map(d => d.category),
          datasets: [{
            data: rows.map(d => d.revenue),
            backgroundColor: rows.map((_, i) => palette[i % palette.length]),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: cssVar('--text-muted'), boxWidth: 10, font: { size: 11 } } }
          }
        }
      });
    });

  /* ---------- top products table + search ---------- */
  let allProducts = [];
  const productsBody = document.getElementById('productsBody');
  const productCount = document.getElementById('productCount');

  function renderProducts(rows) {
    if (!rows.length) {
      productsBody.innerHTML = '<tr><td colspan="3" class="loading-row">No matching products</td></tr>';
      return;
    }
    productsBody.innerHTML = rows.map(p => `
      <tr>
        <td>${p.sku}</td>
        <td>${p.category}</td>
        <td>${fmtCurrency(p.revenue)}</td>
      </tr>
    `).join('');
  }

  fetch('/api/top-products')
    .then(r => r.json())
    .then(data => {
      allProducts = data.top_products;
      productCount.textContent = `${allProducts.length} products`;
      renderProducts(allProducts);
    });

  document.getElementById('productSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.sku.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });

});

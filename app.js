/* =========================================
   EYECON STORE - APP.JS
   Products: First 6
   Combos: First 3
========================================= */

const WHATSAPP_NUMBER = "919072295690";

/* =========================================
   SINGLE PRODUCTS
   Image files: assets/SE0001.png etc.
   stock: "available" or "out"
========================================= */

const products = [
  {
    code: "SE0001",
    name: "Premium Almonds",
    category: "Nuts",
    weight: "500g",
    price: 449,
    mrp: 549,
    desc: "Premium quality whole almonds, carefully selected for freshness and taste.",
    image: "SE0001.png",
    stock: "available"
  },
  {
    code: "SE0002",
    name: "Premium Cashews",
    category: "Nuts",
    weight: "500g",
    price: 499,
    mrp: 599,
    desc: "Delicious premium cashews with a rich, creamy taste and crunchy texture.",
    image: "SE0002.png",
    stock: "out"
  },
  {
    code: "SE0003",
    name: "Premium Pistachios",
    category: "Nuts",
    weight: "250g",
    price: 299,
    mrp: 349,
    desc: "Quality pistachios with a delicious nutty flavour.",
    image: "SE0003.png",
    stock: "available"
  },
  {
    code: "SE0004",
    name: "Premium Walnuts",
    category: "Nuts",
    weight: "250g",
    price: 279,
    mrp: 329,
    desc: "Premium walnut kernels with a rich, natural taste.",
    image: "SE0004.png",
    stock: "available"
  },
  {
    code: "SE0005",
    name: "Natural Forest Honey",
    category: "Honey",
    weight: "500g",
    price: 349,
    mrp: 399,
    desc: "Natural forest honey with a rich taste and golden colour.",
    image: "SE0005.png",
    stock: "available"
  },
  {
    code: "SE0006",
    name: "Raw Honey",
    category: "Honey",
    weight: "250g",
    price: 199,
    mrp: 249,
    desc: "Pure-style raw honey with a naturally rich flavour.",
    image: "SE0006.png",
    stock: "out"
  }

];


/* =========================================
   COMBOS
   Image files: assets/SECO01.png etc.
========================================= */

const combos = [
  {
    code: "SECO01",
    name: "Premium Nuts Combo",
    desc: "Almonds + Cashews + Pistachios",
    price: 1199,
    mrp: 1499,
    image: "SECO01.png",
    stock: "available"
  },
  {
    code: "SECO02",
    name: "Premium Dates Combo",
    desc: "Ajwa + Medjool + Sukkari",
    price: 1299,
    mrp: 1599,
    image: "SECO02.png",
    stock: "available"
  },
  {
    code: "SECO03",
    name: "Nuts & Honey Combo",
    desc: "Almonds + Cashews + Forest Honey",
    price: 999,
    mrp: 1299,
    image: "SECO03.png",
    stock: "available"
  }
];


/* =========================================
   CART & SETTINGS
========================================= */

const CART_STORAGE_KEY = "eyeconStoreCartV2";

let cart = {};

try {
  cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}") || {};
} catch (error) {
  cart = {};
}

let category = "All";
let quantities = {};


/* =========================================
   BANNER SLIDER
   Keep these image paths aligned with assets.
========================================= */

const banners = [
  {
    src: "assets/banner-combos.jpg",
    mobile: "assets/banner-combos-mobile.jpg",
    alt: "EyeCon Store premium combo collection",
    href: "#combos",
    kicker: "CURATED VALUE COMBOS",
    title: "A little more goodness.<br><em>All in one box.</em>",
    description: "Thoughtfully paired nuts, honey and premium dates for everyday goodness."
  },
  {
    src: "assets/banner-nuts.jpg",
    mobile: "assets/banner-nuts-mobile.jpg",
    alt: "Premium nuts collection",
    href: "#products",
    category: "Nuts",
    kicker: "THE NUTS COLLECTION",
    title: "Naturally good.<br><em>Delightfully crunchy.</em>",
    description: "Discover carefully selected almonds, cashews, pistachios and walnuts."
  },
  {
    src: "assets/banner-honey.jpg",
    mobile: "assets/banner-honey-mobile.jpg",
    alt: "Natural honey collection",
    href: "#products",
    category: "Honey",
    kicker: "THE HONEY COLLECTION",
    title: "A golden touch of<br><em>natural goodness.</em>",
    description: "Explore our honey collection, selected for its rich taste and everyday versatility."
  }
];

let bannerIndex = 0;

function setBanner(index) {
  const image = document.getElementById("hero-img");
  const mobileSource = document.getElementById("hero-mobile-source");
  const kicker = document.getElementById("hero-kicker");
  const title = document.getElementById("hero-title");
  const description = document.getElementById("hero-description");
  const shopLink = document.getElementById("hero-shop-link");

  if (!image || !kicker || !title || !description || !shopLink) return;

  bannerIndex = (index + banners.length) % banners.length;
  const banner = banners[bannerIndex];

  image.src = banner.src;
  image.alt = banner.alt;

  if (mobileSource) {
    mobileSource.srcset = banner.mobile;
  }

  kicker.textContent = banner.kicker;
  title.innerHTML = banner.title;
  description.textContent = banner.description;

  shopLink.href = banner.href;
  shopLink.onclick = () => {
    if (banner.category) {
      filterCategory(banner.category);
    }
  };

  document.querySelectorAll(".hero-dots button").forEach((dot, i) => {
    dot.classList.toggle("active", i === bannerIndex);
  });
}

function changeBanner(direction) {
  setBanner(bannerIndex + direction);
}

if (document.getElementById("hero-img")) {
  setBanner(0);
  setInterval(() => changeBanner(1), 6500);
}


/* =========================================
   SEARCH BAR
========================================= */

function toggleSearch() {
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");

  if (!searchBar || !searchInput) return;

  searchBar.classList.toggle("show");
  searchInput.focus();
}


/* =========================================
   COMMON HELPERS
========================================= */

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function findItem(code) {
  return products.find(item => item.code === code)
    || combos.find(item => item.code === code);
}


/* =========================================
   PRODUCT & COMBO CARD
   Single product background: #faf5f1
   Combo background: #ffd5b1
========================================= */

function productCard(item, isCombo = false) {
  const isOutOfStock = item.stock === "out";
  const imageBackground = isCombo ? "#ffd5b1" : "#faf5f1";

  return `
    <article class="product-card ${isOutOfStock ? "out-of-stock" : ""}">

      <div class="product-photo" style="background:${imageBackground};">

        <img
          src="assets/${item.image}"
          alt="${item.name}"
          loading="lazy"
        >

        ${isCombo ? '<span class="product-tag">COMBO</span>' : ""}

        <span class="stock-label ${isOutOfStock ? "stock-out" : "stock-available"}">
          ${isOutOfStock ? "OUT OF STOCK" : "AVAILABLE"}
        </span>

        <button
          class="wish"
          onclick="this.textContent=this.textContent==='♡'?'♥':'♡'"
          aria-label="Wishlist"
          type="button"
        >♡</button>

      </div>

      <div class="product-info">

        <h3>${item.name}</h3>

        <p>${isCombo ? item.desc : item.desc}</p>

        <span class="product-code">
          ${item.code} · ${isCombo ? "Combo Pack" : item.weight}
        </span>

        <div class="price">
          ${money(item.price)}
          <span class="old-price">${money(item.mrp)}</span>
        </div>

        <div class="quantity">
          <button
            type="button"
            onclick="changeQty('${item.code}',-1)"
            ${isOutOfStock ? "disabled" : ""}
            aria-label="Decrease quantity"
          >−</button>

          <span id="qty-${item.code}">${quantities[item.code] || 1}</span>

          <button
            type="button"
            onclick="changeQty('${item.code}',1)"
            ${isOutOfStock ? "disabled" : ""}
            aria-label="Increase quantity"
          >＋</button>
        </div>

        <button
          class="add-cart"
          type="button"
          onclick="addToCart('${item.code}',${isCombo})"
          ${isOutOfStock ? "disabled" : ""}
        >
          ${isOutOfStock ? "Out of Stock" : "🛒　Add to cart"}
        </button>

      </div>
    </article>
  `;
}


/* =========================================
   QUANTITY SELECTOR
========================================= */

function changeQty(code, difference) {
  const item = findItem(code);

  if (!item || item.stock === "out") return;

  quantities[code] = Math.max(
    1,
    (quantities[code] || 1) + difference
  );

  const quantityElement = document.getElementById("qty-" + code);

  if (quantityElement) {
    quantityElement.textContent = quantities[code];
  }
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(code, isCombo = false) {
  const item = findItem(code);

  if (!item) return;

  if (item.stock === "out") {
    alert("Sorry, this item is currently out of stock.");
    return;
  }

  if (!cart[code]) {
    cart[code] = {
      ...item,
      isCombo,
      qty: 0
    };
  }

  cart[code].qty += quantities[code] || 1;

  saveCart();
  openCart();
}


/* =========================================
   SAVE CART & CART COUNT
========================================= */

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

  const count = Object.values(cart).reduce(
    (total, item) => total + item.qty,
    0
  );

  const cartCount = document.getElementById("cart-count");
  const bagCount = document.getElementById("bag-count");

  if (cartCount) cartCount.textContent = count;
  if (bagCount) bagCount.textContent = "(" + count + ")";

  renderCart();
}


/* =========================================
   DELIVERY & TOTAL CALCULATIONS
========================================= */

function subTotal() {
  return Object.values(cart).reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
}

function hasCombo() {
  return Object.values(cart).some(item => item.isCombo);
}

function delivery() {
  if (subTotal() === 0) return 0;

  if (subTotal() >= 1500 || hasCombo()) {
    return 0;
  }

  return 60;
}


/* =========================================
   CART DISPLAY
========================================= */

function renderCart() {
  const cartItems = document.getElementById("cart-items");

  if (!cartItems) return;

  const items = Object.values(cart);

  cartItems.innerHTML = items.length
    ? items.map(item => `
        <div class="cart-row">
          <img src="assets/${item.image}" alt="${item.name}">

          <div>
            <b>${item.name}</b>
            <small>${item.code} · Qty ${item.qty} · ${money(item.price)} each</small>
            <button type="button" onclick="removeItem('${item.code}')">Remove</button>
          </div>

          <b>${money(item.price * item.qty)}</b>
        </div>
      `).join("")
    : '<div class="empty-cart">Your shopping bag is empty.</div>';

  const subtotalElement = document.getElementById("subtotal");
  const deliveryElement = document.getElementById("delivery");
  const totalElement = document.getElementById("total");
  const shippingNote = document.getElementById("shipping-note");

  if (subtotalElement) subtotalElement.textContent = money(subTotal());
  if (deliveryElement) deliveryElement.textContent = delivery() === 0 ? "FREE" : money(delivery());
  if (totalElement) totalElement.textContent = money(subTotal() + delivery());

  if (shippingNote) {
    shippingNote.textContent = hasCombo()
      ? "Your cart includes a combo — delivery is free."
      : "Free delivery on orders of ₹1,500 or more.";
  }
}


/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(code) {
  delete cart[code];
  saveCart();
}


/* =========================================
   CART OPEN / CLOSE
========================================= */

function openCart() {
  document.getElementById("cart-panel")?.classList.add("open");
  document.getElementById("shade")?.classList.add("show");
}

function closeCart() {
  document.getElementById("cart-panel")?.classList.remove("open");
  document.getElementById("shade")?.classList.remove("show");
}


/* =========================================
   STOCK VALIDATION
========================================= */

function checkCartStock() {
  const unavailableItems = Object.values(cart).filter(cartItem => {
    const currentItem = findItem(cartItem.code);
    return !currentItem || currentItem.stock === "out";
  });

  if (unavailableItems.length > 0) {
    alert(
      "These item(s) are unavailable:\n\n" +
      unavailableItems.map(item => item.name).join("\n") +
      "\n\nPlease remove them from your cart before checkout."
    );

    return false;
  }

  return true;
}


/* =========================================
   CHECKOUT MODAL
========================================= */

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Your shopping bag is empty.");
    return;
  }

  if (!checkCartStock()) return;

  closeCart();
  document.getElementById("checkout-modal")?.classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkout-modal")?.classList.remove("show");
}


/* =========================================
   CATEGORY FILTER
========================================= */

function filterCategory(selectedCategory) {
  category = selectedCategory;

  document.querySelectorAll(".filter-tabs button").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === selectedCategory
    );
  });

  renderProducts();
}


/* =========================================
   PRODUCT SEARCH & DISPLAY
========================================= */

function renderProducts() {
  const searchQuery = (
    document.getElementById("product-search")?.value
    || document.getElementById("search-input")?.value
    || ""
  ).toLowerCase().trim();

  const filteredProducts = products.filter(item => {
    const matchesCategory =
      category === "All" || item.category === category;

    const matchesSearch =
      !searchQuery
      || item.name.toLowerCase().includes(searchQuery)
      || item.code.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  const productGrid = document.getElementById("product-grid");

  if (productGrid) {
    productGrid.innerHTML = filteredProducts.length
      ? filteredProducts.map(item => productCard(item)).join("")
      : "<p>No products found.</p>";
  }
}


/* =========================================
   WHATSAPP CHECKOUT
========================================= */

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!checkCartStock()) {
      closeCheckout();
      return;
    }

    const formData = new FormData(event.target);

    const orderItems = Object.values(cart).map(item =>
      `• ${item.name} (${item.code}) × ${item.qty} = ${money(item.price * item.qty)}`
    ).join("\n");

    const orderMessage =
`*NEW ORDER — EYECON STORE*

*CUSTOMER DETAILS*
Name: ${formData.get("name")}
Mobile: ${formData.get("phone")}

*DELIVERY ADDRESS*
${formData.get("house")}, ${formData.get("street")}
Landmark: ${formData.get("landmark") || "Not provided"}
${formData.get("city")}, ${formData.get("district")}
${formData.get("state")} - ${formData.get("pin")}

*ORDER ITEMS*
${orderItems}

Subtotal: ${money(subTotal())}
Delivery: ${delivery() === 0 ? "FREE" : money(delivery())}
*GRAND TOTAL: ${money(subTotal() + delivery())}*
Payment: ${formData.get("payment")}

Please confirm my order.`;

    const whatsappURL =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(orderMessage);

    window.open(whatsappURL, "_blank");
  });
}


/* =========================================
   INITIAL WEBSITE LOAD
========================================= */

const comboGrid = document.getElementById("combo-grid");

if (comboGrid) {
  comboGrid.innerHTML = combos
    .map(item => productCard(item, true))
    .join("");
}

renderProducts();
saveCart();

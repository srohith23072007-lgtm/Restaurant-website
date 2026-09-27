document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("primary-navigation");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsElement = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
  const cart = new Map();
  let toastTimer;

  document.getElementById("current-year").textContent = new Date().getFullYear();

  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toast.classList.remove("success", "error", "show");
    toast.classList.add(type, "show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navToggle.classList.toggle("active", isOpen);
    navLinks.classList.toggle("active", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (navLinks.classList.contains("active") && !nav.contains(event.target)) closeMenu();
  });

  document.querySelectorAll(".menu-category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      document.querySelectorAll(".menu-category-btn").forEach((categoryButton) => {
        const isActive = categoryButton === button;
        categoryButton.classList.toggle("active", isActive);
        categoryButton.setAttribute("aria-pressed", String(isActive));
      });
      document.querySelectorAll(".menu-card").forEach((card) => {
        card.classList.toggle("hidden", selectedCategory !== "all" && card.dataset.category !== selectedCategory);
      });
    });
  });

  function updateCart() {
    const quantity = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = quantity;
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
    document.getElementById("cart-open").setAttribute("aria-label", `Open cart, ${quantity} ${quantity === 1 ? "item" : "items"}`);
    document.getElementById("cart-heading-count").textContent = `(${quantity})`;

    if (cart.size === 0) {
      cartItemsElement.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-basket-shopping" aria-hidden="true"></i><p>Your bag is waiting for something delicious.</p></div>';
      document.getElementById("cart-total").textContent = currency.format(0);
      return;
    }

    cartItemsElement.replaceChildren();
    let total = 0;
    cart.forEach((item, id) => {
      total += item.price * item.quantity;
      const row = document.createElement("article");
      row.className = "cart-item";

      const imageWrap = document.createElement("div");
      imageWrap.className = "cart-item-image";
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = "";
      image.loading = "lazy";
      imageWrap.append(image);

      const info = document.createElement("div");
      info.className = "cart-item-info";
      const name = document.createElement("p");
      name.className = "cart-item-name";
      name.textContent = item.name;
      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = currency.format(item.price * item.quantity);
      info.append(name, price);

      const quantityControls = document.createElement("div");
      quantityControls.className = "cart-item-qty";
      quantityControls.innerHTML = `<button type="button" data-cart-action="decrease" data-id="${id}" aria-label="Remove one ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-cart-action="increase" data-id="${id}" aria-label="Add one ${item.name}">+</button>`;
      row.append(imageWrap, info, quantityControls);
      cartItemsElement.append(row);
    });
    document.getElementById("cart-total").textContent = currency.format(total);
  }

  function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    cartSidebar.setAttribute("aria-hidden", "false");
    cartOverlay.setAttribute("aria-hidden", "false");
    document.getElementById("cart-close").focus();
  }

  function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    cartSidebar.setAttribute("aria-hidden", "true");
    cartOverlay.setAttribute("aria-hidden", "true");
    document.getElementById("cart-open").focus();
  }

  document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".menu-card");
      const id = card.querySelector(".menu-card-name").textContent;
      const item = cart.get(id);
      if (item) item.quantity += 1;
      else {
        cart.set(id, {
          name: id,
          price: Number(card.querySelector(".menu-card-price").dataset.price),
          image: card.querySelector(".menu-card-image img").src,
          quantity: 1
        });
      }
      updateCart();
      button.classList.add("added");
      button.textContent = "Added";
      window.setTimeout(() => {
        button.classList.remove("added");
        button.textContent = "Add to Cart";
      }, 900);
      showToast(`${id} added to your bag.`);
    });
  });

  cartItemsElement.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const item = cart.get(button.dataset.id);
    if (!item) return;
    if (button.dataset.cartAction === "increase") item.quantity += 1;
    else if (item.quantity > 1) item.quantity -= 1;
    else cart.delete(button.dataset.id);
    updateCart();
  });

  document.getElementById("cart-open").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.getElementById("cart-checkout").addEventListener("click", () => {
    closeCart();
    document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
    showToast("Your bag is ready. Send us a booking request to plan your visit.");
  });
  updateCart();

  const reservationForm = document.getElementById("reservation-form");
  const reservationSuccess = document.getElementById("reservation-success");
  const dateInput = document.getElementById("booking-date");
  const today = new Date();
  dateInput.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");

  function showFieldError(input, message) {
    const group = input.closest(".form-group");
    const error = group.querySelector(".error-msg");
    group.classList.toggle("error", Boolean(message));
    error.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [
      [reservationForm.elements.name, reservationForm.elements.name.value.trim() ? "" : "Please enter your name."],
      [reservationForm.elements.email, validEmail(reservationForm.elements.email.value) ? "" : "Enter a valid email address."],
      [reservationForm.elements.phone, /^[+\d][\d\s().-]{6,19}$/.test(reservationForm.elements.phone.value.trim()) ? "" : "Enter a valid phone number."],
      [reservationForm.elements.guests, reservationForm.elements.guests.value ? "" : "Choose the number of guests."],
      [dateInput, dateInput.value && dateInput.value >= dateInput.min ? "" : "Choose today or a future date."],
      [reservationForm.elements.time, reservationForm.elements.time.value ? "" : "Choose a booking time."]
    ];
    const isValid = fields.map(([input, message]) => showFieldError(input, message)).every(Boolean);
    if (!isValid) {
      reservationForm.querySelector("[aria-invalid='true']").focus();
      showToast("Please check the highlighted booking details.", "error");
      return;
    }

    document.getElementById("booking-confirmation-name").textContent = reservationForm.elements.name.value.trim().split(/\s+/)[0];
    reservationForm.reset();
    dateInput.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
    reservationForm.hidden = true;
    reservationSuccess.classList.add("show");
    showToast("Your table request is ready to confirm.");
  });

  document.getElementById("book-again").addEventListener("click", () => {
    reservationSuccess.classList.remove("show");
    reservationForm.hidden = false;
    reservationForm.querySelector("input").focus();
  });

  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("contact-success");
  const contactError = document.getElementById("contact-error");
  contactForm.addEventListener("input", () => {
    contactSuccess.classList.remove("show");
    contactError.textContent = "";
  });
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [
      [contactForm.elements.name, contactForm.elements.name.value.trim() ? "" : "Please enter your name."],
      [contactForm.elements.email, validEmail(contactForm.elements.email.value) ? "" : "Enter a valid email address."],
      [contactForm.elements.message, contactForm.elements.message.value.trim() ? "" : "Please add a message."]
    ];
    const isValid = fields.map(([input, message]) => showFieldError(input, message)).every(Boolean);
    if (!isValid) {
      contactForm.querySelector("[aria-invalid='true']").focus();
      contactError.textContent = "Please check the highlighted fields.";
      return;
    }
    contactSuccess.textContent = `Thanks, ${contactForm.elements.name.value.trim()}. The form is validated; connect it to an email service to deliver your message.`;
    contactSuccess.classList.add("show");
    contactForm.reset();
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.getElementById("lightbox-close").focus();
    });
  });
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const backToTop = document.getElementById("back-to-top");
  function updateScrollState() {
    const hasScrolled = window.scrollY > 50;
    nav.classList.toggle("scrolled", hasScrolled);
    backToTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => element.classList.add("visible"));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (cartSidebar.classList.contains("active")) closeCart();
      if (lightbox.classList.contains("active")) closeLightbox();
      if (navLinks.classList.contains("active")) closeMenu();
    }
  });
});

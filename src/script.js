
const openCartBtn = document.getElementById("openCartBtn");
const closeBtn = document.getElementById("closeBtn");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const addButtons = document.querySelectorAll(".addBtn");

let cart = [];

function addToCart(name, price) {

    cart.push({ name: name, price: price });

    renderCart();
}

function renderCart() {
   
    cartItems.innerHTML = "";

   
    let total = 0;


    cart.forEach(function(item) {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.name}</span><span>${item.price} руб.</span>`;
        cartItems.appendChild(li);

      total += item.price;
    });


    totalPrice.textContent = total;

    cartCount.textContent = cart.length;
}

openCartBtn.addEventListener("click", function() {
    cartModal.classList.add("active");
});


closeBtn.addEventListener("click", function() {
    cartModal.classList.remove("active");
});


cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.classList.remove("active");
    }
});


addButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        addToCart(name, price);
    });
});
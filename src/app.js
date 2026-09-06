// Переменная состояния для хранения количества товаров
let cartCount = 0;

//Функция инициализации функционала шапки

function initHeaderLogic() {
  const cartBtn = document.getElementById("cart-btn");
  const cartBadge = document.getElementById("cart-badge");
  const searchInput = document.querySelector(".search__input");

  if (!cartBtn || !cartBadge || !searchInput) return;

  // Функционал корзины: клик увеличивает число и включает модификатор видимости
  cartBtn.addEventListener("click", () => {
    cartCount++;
    cartBadge.textContent = cartCount;

    cartBadge.classList.add("nav__badge--visible");
  });

  // Функционал поиска: реагирует на нажатие клавиши Enter
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query !== "") {
        alert(`Запрос отправлен в обработку: "${query}"`);
        searchInput.value = "";
      }
    }
  });
}

initHeaderLogic();

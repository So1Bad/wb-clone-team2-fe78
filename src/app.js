import { createProductCard, renderProductCards } from './dom.js';

// Переменная состояния для хранения количества товаров
let cartCount = 0;
let cardArr = [];

const cartBadge = document.getElementById("cart-badge");
const itemsContainer = document.querySelector('.items');

// Функция для обновления счетчика на странице
function updateCartBadge() {
   if (!cartBadge) return;

   cartBadge.textContent = cartCount;

   // Если товаров > 0, показываем бейдж, иначе скрываем
   if (cartCount > 0) {
      cartBadge.classList.add("nav__badge--visible");
   } else {
      cartBadge.classList.remove("nav__badge--visible");
   }
}

//Функция инициализации функционала шапки
function initHeaderLogic() {
   const cartBtn = document.getElementById("cart-btn");
   const searchInput = document.querySelector(".search__input");

   if (!cartBtn || !searchInput) return;

   // Функционал корзины: клик увеличивает число и включает модификатор видимости
   cartBtn.addEventListener("click", () => {
      cartCount++;
      updateCartBadge();
   });


   searchInput.addEventListener("input", () => {
      const search = searchInput.value.trim().toLowerCase();

      // Фильтруем оригинальный массив товаров по имени
      const filteredProducts = cardArr.filter(product => {
         return product.name.toLowerCase().includes(search);
      });

      // Перерисовываем карточки. Если ничего не найдено, контейнер просто очистится
      renderProductCards(filteredProducts, itemsContainer);

      // Выводим сообщение , если поиск не дал результатов
      if (filteredProducts.length === 0 && search !== "") {
         itemsContainer.innerHTML = `<p class="search-empty">По запросу "${searchInput.value}" ничего не найдено</p>`;
      }
   });
}

initHeaderLogic();

document.addEventListener('DOMContentLoaded', () => {
   const track = document.querySelector('.slider-track');
   const slides = document.querySelectorAll('.slide');
   const prevBtn = document.querySelector('.prev-btn');
   const nextBtn = document.querySelector('.next-btn');
   const pagination = document.querySelector('.slider-pagination');

   let index = 0;


   slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('pagination-dot');
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => changeSlide(i));
      pagination.appendChild(dot);
   });

   const dots = document.querySelectorAll('.pagination-dot');


   function changeSlide(newIndex) {
      index = newIndex;


      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) => {
         dot.classList.toggle('active', i === index);
      });
   }


   nextBtn.addEventListener('click', () => {

      const nextIndex = (index === slides.length - 1) ? 0 : index + 1;
      changeSlide(nextIndex);
   });

   prevBtn.addEventListener('click', () => {

      const prevIndex = (index === 0) ? slides.length - 1 : index - 1;
      changeSlide(prevIndex);
   });
});


const url = 'https://6aa285e0ccb3db9689a69463.mockapi.io/wbclone/Cards';
fetch(url)
   .then((res) => {
      if (!res.ok) {
         throw new Error(res.status)
      }
      return res.json();
   }
   ).then((res) => {
      cardArr = res;

      cardArr.forEach((product) => {
         product.finalPrice = (product.price - (product.price * (product.discount / 100))).toFixed(2)
         if (product.inCart) {
            cartCount++;
         }
      })

      updateCartBadge();

      console.log(cardArr);
      renderProductCards(cardArr, itemsContainer);

      if (itemsContainer) {
         itemsContainer.addEventListener('click', (event) => {
            const binBtn = event.target.closest('.card__bin');
            if (!binBtn) return;

            const cardElement = binBtn.closest('.items__card');
            if (!cardElement) return;

            // Находим ID карточки, по которой кликнули
            const productId = cardElement.dataset.id;
            // Ищем соответствующий объект товара в нашем массиве
            const productObj = cardArr.find(p => p.id === productId);

            if (!productObj) return;

            // Переключаем класс
            binBtn.classList.toggle('card__InCard');
            productObj.inCart = binBtn.classList.contains('card__InCard');

            if (productObj.inCart) {
               cartCount++;
            } else {
               cartCount--;
            }

            // Обновляем отображение в шапке
            updateCartBadge();

            console.log(`Товар "${productObj.name}" в корзине: ${productObj.inCart}. Всего в корзине: ${cartCount}`);
         });
      } else {
         console.error('Контейнер с классом .items не найден на странице!');
      }
   })
   .catch((e) => {
      console.log(e)
   })
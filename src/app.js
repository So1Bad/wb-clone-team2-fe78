import { renderProductCards, openQuickViewModal, openCartModal } from './dom.js';

// Переменная состояния для хранения количества товаров
let cartCount = 0;
let cardArr = [];

const cartBadge = document.getElementById("cart-badge");
const itemsContainer = document.querySelector('.items');

function saveCartToLocalStorage() {
   const savedIds = cardArr
      .filter(product => product.inCart)
      .map(product => product.id);

   localStorage.setItem('wbCart', JSON.stringify(savedIds));
}

function getCartFromLocalStorage() {
   const data = localStorage.getItem('wbCart');
   return data ? JSON.parse(data) : [];
}
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

   cartBtn.addEventListener("click", () => {
      // Фильтруем массив, берем только добавленные товары
      const addedProducts = cardArr.filter(product => product.inCart === true);

      // Открываем модалку и передаем туда товары + функцию очистки
      openCartModal(addedProducts, clearAllCart);
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

function clearAllCart() {
   cardArr.forEach(product => {
      product.inCart = false;
   });

   cartCount = 0;
   updateCartBadge();
   saveCartToLocalStorage();

   const allActiveButtons = itemsContainer.querySelectorAll('.card__bin.card__InCard');
   allActiveButtons.forEach(btn => btn.classList.remove('card__InCard'));

   console.log('Корзина полностью очищена');
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
      const savedCartIds = getCartFromLocalStorage();

      cardArr.forEach((product) => {
         product.finalPrice = (product.price - (product.price * (product.discount / 100))).toFixed(2)
         if (savedCartIds.includes(product.id)) {
            product.inCart = true;
            cartCount++;
         } else {
            product.inCart = false;
         }
      })

      updateCartBadge();
      renderProductCards(cardArr, itemsContainer);

      function toggleProductCartStatus(productId) {
         // Ищем соответствующий объект товара в нашем массиве
         const productObj = cardArr.find(p => p.id === productId);
         if (!productObj) return false;

         // Инвертируем статус
         productObj.inCart = !productObj.inCart;

         // Меняем счетчик
         if (productObj.inCart) {
            cartCount++;
         } else {
            cartCount--;
         }
         updateCartBadge();
         saveCartToLocalStorage();

         // Синхронизируем карточку на главной странице, если она отрисована
         const cardElement = itemsContainer.querySelector(`.items__card[data-id="${productId}"]`);
         if (cardElement) {
            const binBtn = cardElement.querySelector('.card__bin');
            if (binBtn) {
               binBtn.classList.toggle('card__InCard', productObj.inCart);
            }
         }

         console.log(`Товар "${productObj.name}" изменен. В корзине: ${productObj.inCart}. Всего: ${cartCount}`);
         return productObj.inCart;
      }


      if (itemsContainer) {
         itemsContainer.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.items__card');
            if (!cardElement) return;

            // Находим ID карточки, по которой кликнули
            const productId = cardElement.dataset.id;

            const binBtn = event.target.closest('.card__bin');
            if (binBtn) {
               toggleProductCartStatus(productId);
               return;
            }
            // 2. Клик по кнопке быстрого просмотра
            const viewBtn = event.target.closest('.card__view');
            if (viewBtn) {
               const productObj = cardArr.find(p => p.id === productId);
               if (productObj) {
                  // Передаем объект товара и наш колбэк для синхронизации
                  openQuickViewModal(productObj, toggleProductCartStatus);
               }
            }
         });
      } else {
         console.error('Контейнер с классом .items не найден на странице!');
      }
   })
   .catch((e) => {
      console.log(e)
   })
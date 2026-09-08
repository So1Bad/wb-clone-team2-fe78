import { createProductCard, productItem } from './dom.js';

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

const item1 = new productItem('Шины', '5000', '20%', new URL('./media/product1.webp', import.meta.url).href)
const item2 = new productItem('Набор для шашлыка', '500', '5%', new URL('./media/product2.webp', import.meta.url).href);
const item3 = new productItem('Кросовки', '300', '50%', new URL('./media/product3.webp', import.meta.url).href);
const item4 = new productItem('Набор нижнего белья', '50', '30%', new URL('./media/product4.webp', import.meta.url).href);
const item5 = new productItem('Зимние шины', '3000', '25%', new URL('./media/product5.webp', import.meta.url).href);
const item6 = new productItem('Тетради', '30', '10%', new URL('./media/product6.webp', import.meta.url).href);

const productsArray = [];
productsArray.push(item1, item2, item3, item4, item5, item6);
const itemsContainer = document.querySelector('.items');
if (itemsContainer) {
   const fragment = document.createDocumentFragment();
   productsArray.forEach(product => {
      const cardElement = createProductCard(product);
      fragment.append(cardElement);
   });
   itemsContainer.append(fragment);

   itemsContainer.addEventListener('click', (event) => {
      const binBtn = event.target.closest('.card__bin');
      if (!binBtn) return;

      const cardElement = binBtn.closest('.items__card');
      if (!cardElement) return;

      // Находим ID карточки, по которой кликнули
      const productId = cardElement.dataset.id;
      // Ищем соответствующий объект товара в нашем массиве
      const productObj = productsArray.find(p => p.id === productId);

      // Переключаем класс визуально
      binBtn.classList.toggle('card__InCard');

      // Обновляем статус inCart внутри объекта
      if (productObj) {
         productObj.inCart = binBtn.classList.contains('card__InCard');
         console.log(`Товар "${productObj.name}" в корзине: ${productObj.inCart}`);
      }
   });
} else {
   console.error('Контейнер с классом .items не найден на странице!');
}

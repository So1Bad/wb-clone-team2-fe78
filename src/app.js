import { createProductCard, productItem } from './dom.js';


const item1 = new productItem('Шины', '5000', '20%', 'media/product1.webp')
const item2 = new productItem('Набор для шашлыка', '500', '5%', 'media/product2.webp');
const item3 = new productItem('Кросовки', '300', '50%', 'media/product3.webp');
const item4 = new productItem('Набор нижнего белья', '50', '30%', 'media/product4.webp');
const item5 = new productItem('Зимние шины', '3000', '25%', 'media/product5.webp');
const item6 = new productItem('Тетради', '30', '10%', 'media/product6.webp');

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
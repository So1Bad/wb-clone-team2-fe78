export const createDomElement = (tag, options) => {
   const newElement = document.createElement(tag);
   if (options.className) {
      newElement.className = options.className
   }
   if (options.textContent) {
      newElement.textContent = options.textContent
   }
   if (options.placeholder) {
      newElement.placeholder = options.placeholder
   }
   if (options.src) { newElement.src = options.src; }
   return newElement
}

export const createProductCard = (productItem) => {
   // Создаем главный контейнер карточки
   const card = createDomElement('div', {
      className: 'items__card card'
   });
   card.dataset.id = productItem.id;
   // Изображение товара
   const img = createDomElement('img', {
      className: 'card__img',
      src: productItem.path // Путь к картинке (например, 'media/product1.webp')
   });

   // Внутренний блок с акцией и корзиной
   const innerInfo = createDomElement('div', {
      className: 'card__inner-info'
   });

   const discount = createDomElement('p', {
      className: 'card__discount',
      textContent: `-${productItem.discount}%` // Текст скидки (например, '-10%')
   });

   const binButton = createDomElement('button', {
      className: `card__bin ${productItem.inCart ? 'card__InCard' : ''}`
   });

   innerInfo.append(discount, binButton);

   // Кнопка быстрого просмотра
   const viewButton = createDomElement('button', {
      className: 'card__view',
      textContent: 'Быстрый просмотр'
   });

   // Блок с ценами и названием
   const infoBlock = createDomElement('div', {
      className: 'card__info info'
   });

   const finalPrice = createDomElement('p', {
      className: 'info__final-price',
      textContent: `${productItem.finalPrice} p` // Финальная цена (например, 900)
   });

   const originalPrice = createDomElement('p', {
      className: 'info__price',
      textContent: `${productItem.price} p` // Старая цена (например, 1000)
   });

   const productName = createDomElement('p', {
      className: 'info__product-name',
      textContent: productItem.name // Название товара (например, 'Штаны')
   });

   infoBlock.append(finalPrice, originalPrice, productName);

   // Собираем всю карточку целиком
   card.append(img, innerInfo, viewButton, infoBlock);

   return card;
};

export const renderProductCards = (products, container) => {
   if (!container) {
      console.error('Контейнер для рендера не найден!');
      return;
   }
   container.innerHTML = '';

   const fragment = document.createDocumentFragment();

   products.forEach(product => {
      const cardElement = createProductCard(product);
      fragment.append(cardElement);
   });

   container.append(fragment);
};
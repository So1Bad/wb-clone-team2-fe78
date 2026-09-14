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
      src: productItem.path // Путь к картинке
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

export const openQuickViewModal = (product, onCartToggle) => {
   let productContainer = document.querySelector('.product');
   if (!productContainer) {
      productContainer = createDomElement('div', { className: 'product' });
      productContainer.style.display = 'none';
      document.body.append(productContainer);
   }

   productContainer.innerHTML = '';

   const fragment = document.createDocumentFragment();

   const modalOverlay = createDomElement('div', { className: 'modal-overlay' });
   const modalContent = createDomElement('div', { className: 'modal-content' });
   const closeBtn = createDomElement('button', { className: 'modal-close', textContent: '×' });

   const modalLeft = createDomElement('div', { className: 'modal-left' });
   const modalImg = createDomElement('img', { className: 'modal-img', src: product.path });
   modalLeft.append(modalImg);

   const modalRight = createDomElement('div', { className: 'modal-right' });

   const textWrapper = createDomElement('div', {});
   const title = createDomElement('h2', { className: 'modal-title', textContent: product.name });
   const pricesBlock = createDomElement('div', { className: 'modal-prices' });
   const finalPrice = createDomElement('span', { className: 'modal-final-price', textContent: `${product.finalPrice} p` });
   const oldPrice = createDomElement('span', { className: 'modal-old-price', textContent: `${product.price} p` });
   pricesBlock.append(finalPrice, oldPrice);
   const description = createDomElement('p', {
      className: 'modal-description',
      textContent: product.description || 'Описание товара временно отсутствует.',
   });
   textWrapper.append(title, pricesBlock, description);

   const actionBtn = createDomElement('button', {
      className: 'modal-action-btn',
      textContent: product.inCart ? 'Удалить из корзины' : 'Добавить в корзину'
   });
   if (product.inCart) {
      actionBtn.classList.add('modal-action-btn-delete');
   }

   modalRight.append(textWrapper, actionBtn);
   modalContent.append(closeBtn, modalLeft, modalRight);
   modalOverlay.append(modalContent);
   fragment.append(modalOverlay);
   productContainer.append(fragment);
   productContainer.style.display = 'block';

   modalOverlay.classList.add('modal--open')

   const closeModal = () => {
      modalOverlay.classList.remove('modal--open');
      productContainer.innerHTML = '';
      productContainer.style.display = 'none';
   };

   closeBtn.addEventListener('click', closeModal);
   modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
   });

   actionBtn.addEventListener('click', () => {
      const isNowInCart = onCartToggle(product.id);

      // Обновляем внешний вид кнопки в модальном окне
      if (isNowInCart) {
         actionBtn.textContent = 'Удалить из корзины';
         actionBtn.classList.add('modal-action-btn-delete');
      } else {
         actionBtn.textContent = 'Добавить в корзину';
         actionBtn.classList.remove('modal-action-btn-delete');
      }
   });
}


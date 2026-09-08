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
   console.log(productItem.path)
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
export class productItem {
   constructor(name, price, discount, path, inCart = false) {
      this.id = crypto.randomUUID().slice(0, 5);
      this.name = name;
      this.price = +price;
      this.discount = +discount.replace('%', '');
      this.finalPrice = this.price - (this.price * (this.discount / 100));
      this.path = path;


      this.inCart = inCart;
   }

   inCart() {
      const items = document.querySelector('.items');

      items.addEventListener('click', (event) => {
         const quickVuiwBtn = event.target.closest('.card__bin');

         if (!quickVuiwBtn) {
            return;
         }

         const item = quickVuiwBtn.closest('.items__card');
         if (!item) {
            return;
         }

         quickVuiwBtn.classList.toggle('card__InCard');

         if (quickVuiwBtn.classList.contains('.card__InCard')) {
            this.inCart = true;
            console.log(quickVuiwBtn)
         }
      })

      return this.inCart;
   }
}
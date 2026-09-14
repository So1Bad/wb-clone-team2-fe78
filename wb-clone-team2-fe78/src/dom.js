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

const lockBodyScroll = () => {
   document.body.classList.add('modal-open');
};

const unlockBodyScroll = () => {
   document.body.classList.remove('modal-open');
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
   const modalContent = createDomElement('div', { className: 'modal-content modal-content--quick-view' });
   const closeBtn = createDomElement('button', { className: 'modal-close', textContent: '×' });

   const modalLeft = createDomElement('div', { className: 'modal-left' });
   const modalImg = createDomElement('img', { className: 'modal-img', src: product.path });
   const modalDiscount = createDomElement('span', {
      className: 'modal-img__discount',
      textContent: `-${product.discount}%`,
   });
   modalLeft.append(modalImg, modalDiscount);

   const modalRight = createDomElement('div', { className: 'modal-right' });

   const textWrapper = createDomElement('div', {});
   const title = createDomElement('h2', { className: 'modal-title', textContent: product.name });
   const pricesBlock = createDomElement('div', { className: 'modal-prices' });
   const finalPrice = createDomElement('span', { className: 'modal-final-price', textContent: `${product.finalPrice} p` });
   const oldPrice = createDomElement('span', { className: 'modal-old-price', textContent: `${product.price} p` });
   pricesBlock.append(finalPrice, oldPrice);

   const savings = createDomElement('p', {
      className: 'modal-savings',
      textContent: `Выгода ${(product.price - product.finalPrice).toFixed(2)} p`,
   });

   const delivery = createDomElement('div', { className: 'modal-delivery' });
   const deliveryTitle = createDomElement('p', {
      className: 'modal-delivery__title',
      textContent: 'Доставка',
   });
   const deliveryText = createDomElement('p', {
      className: 'modal-delivery__text',
      textContent: 'Завтра, в пункт выдачи — бесплатно',
   });
   delivery.append(deliveryTitle, deliveryText);

   const description = createDomElement('p', {
      className: 'modal-description',
      textContent: product.description || 'Описание товара временно отсутствует.',
   });
   textWrapper.append(title, pricesBlock, savings, delivery, description);

   const actionBtn = createDomElement('button', {
      className: 'modal-action-btn',
      textContent: product.inCart ? 'Удалить из корзины' : 'Добавить в корзину',
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

   lockBodyScroll();
   modalOverlay.classList.add('modal--open');

   const closeModal = () => {
      modalOverlay.classList.remove('modal--open');
      document.removeEventListener('keydown', onEscKey);
      unlockBodyScroll();
      productContainer.innerHTML = '';
      productContainer.style.display = 'none';
   };

   const onEscKey = (e) => {
      if (e.key === 'Escape') closeModal();
   };

   closeBtn.addEventListener('click', closeModal);
   document.addEventListener('keydown', onEscKey);
   modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
   });

   actionBtn.addEventListener('click', () => {
      const isNowInCart = onCartToggle(product.id);

      if (isNowInCart) {
         actionBtn.textContent = 'Удалить из корзины';
         actionBtn.classList.add('modal-action-btn-delete');
      } else {
         actionBtn.textContent = 'Добавить в корзину';
         actionBtn.classList.remove('modal-action-btn-delete');
      }
   });
}

const createCartItemRow = (product, onCartToggle, rerender) => {
   const row = createDomElement('div', { className: 'cart-item' });
   row.dataset.id = product.id;

   const img = createDomElement('img', { className: 'cart-item__img', src: product.path });

   const info = createDomElement('div', { className: 'cart-item__info' });
   const name = createDomElement('p', { className: 'cart-item__name', textContent: product.name });

   const prices = createDomElement('div', { className: 'cart-item__prices' });
   const finalPrice = createDomElement('span', { className: 'cart-item__final-price', textContent: `${product.finalPrice} p` });
   const oldPrice = createDomElement('span', { className: 'cart-item__old-price', textContent: `${product.price} p` });
   const discount = createDomElement('span', { className: 'cart-item__discount', textContent: `-${product.discount}%` });
   prices.append(finalPrice, oldPrice, discount);

   const delivery = createDomElement('p', {
      className: 'cart-item__delivery',
      textContent: 'Доставка завтра, в пункт выдачи — бесплатно',
   });

   info.append(name, prices, delivery);

   const removeBtn = createDomElement('button', { className: 'cart-item__remove', textContent: '×' });
   removeBtn.addEventListener('click', () => {
      onCartToggle(product.id);
      rerender();
   });

   row.append(img, info, removeBtn);
   return row;
};

export const openCartModal = (products, onCartToggle, onOrderComplete) => {
   let productContainer = document.querySelector('.product');
   if (!productContainer) {
      productContainer = createDomElement('div', { className: 'product' });
      productContainer.style.display = 'none';
      document.body.append(productContainer);
   }

   productContainer.innerHTML = '';

   const modalOverlay = createDomElement('div', { className: 'modal-overlay' });
   const modalContent = createDomElement('div', { className: 'modal-content modal-content--cart' });
   const closeBtn = createDomElement('button', { className: 'modal-close', textContent: '×' });
   modalContent.append(closeBtn);
   modalOverlay.append(modalContent);
   productContainer.append(modalOverlay);
   productContainer.style.display = 'block';

   lockBodyScroll();
   modalOverlay.classList.add('modal--open');

   let step = 'cart';

   const closeModal = () => {
      modalOverlay.classList.remove('modal--open');
      document.removeEventListener('keydown', onEscKey);
      unlockBodyScroll();
      productContainer.innerHTML = '';
      productContainer.style.display = 'none';
   };

   const onEscKey = (e) => {
      if (e.key === 'Escape') closeModal();
   };

   closeBtn.addEventListener('click', closeModal);
   document.addEventListener('keydown', onEscKey);
   modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
   });

   const renderCart = () => {
      step = 'cart';
      const cartItems = products.filter((p) => p.inCart);

      const header = createDomElement('div', { className: 'cart-modal__header' });
      const title = createDomElement('h2', {
         className: 'cart-modal__title',
         textContent: `Корзина${cartItems.length ? ` · ${cartItems.length}` : ''}`,
      });
      header.append(title);

      const body = createDomElement('div', { className: 'cart-modal__body' });

      if (cartItems.length === 0) {
         const empty = createDomElement('div', { className: 'cart-modal__empty' });
         const emptyIcon = createDomElement('p', { className: 'cart-modal__empty-icon', textContent: '🛒' });
         const emptyTitle = createDomElement('p', {
            className: 'cart-modal__empty-title',
            textContent: 'В корзине пока ничего нет',
         });
         const emptyText = createDomElement('p', {
            className: 'cart-modal__empty-text',
            textContent: 'Добавьте товары из каталога, чтобы оформить заказ',
         });
         empty.append(emptyIcon, emptyTitle, emptyText);
         body.append(empty);
      } else {
         const list = createDomElement('div', { className: 'cart-modal__list' });
         cartItems.forEach((product) => {
            list.append(createCartItemRow(product, onCartToggle, renderCurrentStep));
         });
         body.append(list);
      }

      const footer = createDomElement('div', { className: 'cart-modal__footer' });

      if (cartItems.length > 0) {
         const totalSum = cartItems.reduce((sum, p) => sum + Number(p.finalPrice), 0);
         const totalOld = cartItems.reduce((sum, p) => sum + Number(p.price), 0);
         const totalDiscount = (totalOld - totalSum).toFixed(2);

         const totals = createDomElement('div', { className: 'cart-modal__totals' });
         const totalCount = createDomElement('p', {
            className: 'cart-modal__totals-row',
            textContent: `Товары (${cartItems.length})`,
         });
         const totalValue = createDomElement('p', { className: 'cart-modal__totals-row cart-modal__totals-row--value', textContent: `${totalSum.toFixed(2)} p` });
         const discountRow = createDomElement('p', {
            className: 'cart-modal__totals-row cart-modal__totals-row--discount',
            textContent: `Скидка: ${totalDiscount} p`,
         });
         totals.append(totalCount, totalValue, discountRow);

         const checkoutBtn = createDomElement('button', {
            className: 'modal-action-btn cart-modal__checkout-btn',
            textContent: 'Перейти к оформлению',
         });
         checkoutBtn.addEventListener('click', renderCheckout);

         footer.append(totals, checkoutBtn);
      } else {
         const backBtn = createDomElement('button', {
            className: 'modal-action-btn cart-modal__checkout-btn',
            textContent: 'Перейти к покупкам',
         });
         backBtn.addEventListener('click', closeModal);
         footer.append(backBtn);
      }

      modalContent.innerHTML = '';
      modalContent.append(closeBtn, header, body, footer);
   };

   const renderCheckout = () => {
      step = 'checkout';
      const cartItems = products.filter((p) => p.inCart);
      const totalSum = cartItems.reduce((sum, p) => sum + Number(p.finalPrice), 0);
      const totalOld = cartItems.reduce((sum, p) => sum + Number(p.price), 0);
      const totalDiscount = (totalOld - totalSum).toFixed(2);

      const header = createDomElement('div', { className: 'cart-modal__header' });
      const backBtn = createDomElement('button', { className: 'cart-modal__back', textContent: '← Назад в корзину' });
      backBtn.addEventListener('click', renderCart);
      const title = createDomElement('h2', { className: 'cart-modal__title', textContent: 'Оформление заказа' });
      header.append(backBtn, title);

      const body = createDomElement('div', { className: 'cart-modal__body cart-modal__body--checkout' });

      const form = createDomElement('form', { className: 'checkout-form' });

      const fieldset = createDomElement('div', { className: 'checkout-form__section' });
      const sectionTitle = createDomElement('p', { className: 'checkout-form__section-title', textContent: 'Получатель' });

      const nameField = createDomElement('input', { className: 'checkout-form__input' });
      nameField.placeholder = 'Имя и фамилия';
      nameField.required = true;

      const phoneField = createDomElement('input', { className: 'checkout-form__input' });
      phoneField.placeholder = 'Телефон';
      phoneField.type = 'tel';
      phoneField.required = true;

      const addressField = createDomElement('input', { className: 'checkout-form__input' });
      addressField.placeholder = 'Адрес пункта выдачи';
      addressField.required = true;

      fieldset.append(sectionTitle, nameField, phoneField, addressField);

      const paymentSection = createDomElement('div', { className: 'checkout-form__section' });
      const paymentTitle = createDomElement('p', { className: 'checkout-form__section-title', textContent: 'Способ оплаты' });

      const cardOption = createDomElement('label', { className: 'checkout-form__option' });
      const cardRadio = createDomElement('input', {});
      cardRadio.type = 'radio';
      cardRadio.name = 'payment';
      cardRadio.value = 'Онлайн-оплата картой';
      cardRadio.checked = true;
      const cardText = createDomElement('span', { textContent: 'Онлайн-оплата картой' });
      cardOption.append(cardRadio, cardText);

      const cashOption = createDomElement('label', { className: 'checkout-form__option' });
      const cashRadio = createDomElement('input', {});
      cashRadio.type = 'radio';
      cashRadio.name = 'payment';
      cashRadio.value = 'При получении';
      const cashText = createDomElement('span', { textContent: 'При получении' });
      cashOption.append(cashRadio, cashText);

      paymentSection.append(paymentTitle, cardOption, cashOption);
      form.append(fieldset, paymentSection);

      const summary = createDomElement('div', { className: 'checkout-summary' });
      const summaryTitle = createDomElement('p', { className: 'checkout-summary__title', textContent: 'Ваш заказ' });

      const summaryList = createDomElement('div', { className: 'checkout-summary__list' });
      cartItems.forEach((product) => {
         const row = createDomElement('div', { className: 'checkout-summary__row' });
         const rowName = createDomElement('span', { textContent: product.name });
         const rowPrice = createDomElement('span', { textContent: `${product.finalPrice} p` });
         row.append(rowName, rowPrice);
         summaryList.append(row);
      });

      const summaryDiscount = createDomElement('p', {
         className: 'checkout-summary__discount',
         textContent: `Скидка: ${totalDiscount} p`,
      });

      const summaryTotal = createDomElement('p', {
         className: 'checkout-summary__total',
         textContent: `Итого: ${totalSum.toFixed(2)} p`,
      });

      const payBtn = createDomElement('button', {
         className: 'modal-action-btn cart-modal__checkout-btn',
         textContent: `Оплатить ${totalSum.toFixed(2)} p`,
      });

      summary.append(summaryTitle, summaryList, summaryDiscount, summaryTotal, payBtn);

      body.append(form, summary);

      modalContent.innerHTML = '';
      modalContent.append(closeBtn, header, body);

      form.addEventListener('submit', (e) => e.preventDefault());
      payBtn.addEventListener('click', () => {
         if (!nameField.value.trim() || !phoneField.value.trim() || !addressField.value.trim()) {
            [nameField, phoneField, addressField].forEach((input) => {
               input.classList.toggle('checkout-form__input--error', !input.value.trim());
            });
            return;
         }
         renderSuccess();
      });
   };

   const renderSuccess = () => {
      step = 'success';
      const body = createDomElement('div', { className: 'cart-modal__body' });
      const success = createDomElement('div', { className: 'cart-modal__success' });
      const successIcon = createDomElement('p', { className: 'cart-modal__success-icon', textContent: '✓' });
      const successTitle = createDomElement('p', {
         className: 'cart-modal__success-title',
         textContent: 'Заказ оформлен!',
      });
      const successText = createDomElement('p', {
         className: 'cart-modal__success-text',
         textContent: 'Мы сообщим вам, когда заказ будет готов к выдаче',
      });
      const doneBtn = createDomElement('button', {
         className: 'modal-action-btn cart-modal__checkout-btn',
         textContent: 'Продолжить покупки',
      });
      doneBtn.addEventListener('click', () => {
         onOrderComplete();
         closeModal();
      });

      const footer = createDomElement('div', { className: 'cart-modal__footer' });
      footer.append(doneBtn);

      success.append(successIcon, successTitle, successText);
      body.append(success);

      modalContent.innerHTML = '';
      modalContent.append(closeBtn, body, footer);
   };

   const renderCurrentStep = () => {
      if (step === 'cart') renderCart();
   };

   renderCart();
}


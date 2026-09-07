class productItem {
  constructor(name, price, discount, inCart = false, finalPrice, path) {
    this.id = crypto.randomUUID().substr(2, 5);
    this.name = name;
    this.price = price;
    this.discount = +discount.substr(0,2);
    this.finalPrice = finalPrice;
    this.path = path;


    this.inCart = inCart;
  }

  finalPrice() {
    return this.finalPrice = this.price - this.price * this.discount;
  }

  inCart() {
    const items = document.querySelector('.items');

    items.addEventListener('click', (event) => {
        const quickVuiwBtn = event.target.closest('.card__bin');

        if(!quickVuiwBtn) {
            return;
        }

        const item = quickVuiwBtn.closest('.items__card');
            if (!item) {
                return;
            }

        quickVuiwBtn.classList.toggle('card__InCard');

        if (quickVuiwBtn.classList.contains('.card__InCard')) {
            this.inCart = true; 
        }
    })

    return this.inCart;
  }
}


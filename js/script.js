// Définir la classe Product
class Product {
  constructor(id, name, description, price, image) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.isLiked = false; // État initial du bouton "Liker"
    this.quantity = 0; // Quantité initiale dans le panier
  }

  // Méthode pour créer la carte HTML d'un produit avec des boutons d'action
  createProductCard() {
    // Création de la structure HTML de la carte du produit
    const card = document.createElement('div');
    card.classList.add('card-body');
    card.innerHTML = `
      <div class="card" style="width: 18rem">
        <img src="${this.image}" class="card-img-top" alt="${this.name}" />
        <div class="card-body">
          <h5 class="card-title">${this.name}</h5>
          <p class="card-text">${this.description}</p>
          <h4 class="unit-price">${this.price} $</h4>
          <div>
            <button class="btn btn-success btn-sm add-to-cart">Add to Cart</button>
            <button class="btn btn-outline-danger btn-sm remove-from-cart">Remove</button>
          </div>
          <div>
            <i class="fas fa-heart like-btn ${this.isLiked ? 'liked' : ''}"></i>
            <span class="quantity">${this.quantity}</span>
            <i class="fas fa-plus-circle plus-btn"></i>
            <i class="fas fa-minus-circle minus-btn"></i>
          </div>
        </div>
      </div>
    `;

    // Ajout d'écouteurs d'événements pour les boutons d'action
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      if (this.quantity > 0) {
        cart.addItem(this, this.quantity);
        updateCart();
        this.quantity = 0; // Réinitialiser la quantité après l'ajout au panier
        card.querySelector('.quantity').textContent = this.quantity;
      } else {
        alert('Please select a quantity greater than zero.');
      }
    });

    const removeFromCartBtn = card.querySelector('.remove-from-cart');
    removeFromCartBtn.addEventListener('click', () => {
      cart.removeItem(this.id);
      updateCart();
    });

    // Écouteurs d'événements pour les boutons + et -
    const plusBtn = card.querySelector('.plus-btn');
    plusBtn.addEventListener('click', () => {
      this.quantity++;
      card.querySelector('.quantity').textContent = this.quantity;
    });

    const minusBtn = card.querySelector('.minus-btn');
    minusBtn.addEventListener('click', () => {
      if (this.quantity > 0) {
        this.quantity--;
        card.querySelector('.quantity').textContent = this.quantity;
      }
    });

    // Écouteur d'événement pour le bouton "Liker"
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      this.isLiked = !this.isLiked;
      likeBtn.classList.toggle('liked', this.isLiked);
    });

    return card;
  }
}

// Classe ShoppingCartItem
class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// Classe ShoppingCart
class ShoppingCart {
  constructor() {
    this.items = []; // Tableau d'articles dans le panier
  }

  // Méthode pour obtenir le nombre total d'articles dans le panier
  getTotalItems() {
    let totalItems = 0;
    this.items.forEach(item => {
      totalItems += item.quantity;
    });
    return totalItems;
  }

  // Méthode pour ajouter un article au panier
  addItem(product, quantity) {
    const newItem = new ShoppingCartItem(product, quantity);
    this.items.push(newItem);
  }

  // Méthode pour supprimer un article du panier en fonction de son ID de produit
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  // Méthode pour afficher les articles du panier
  displayItems() {
    this.items.forEach(item => {
      console.log(`Product: ${item.product.name}, Quantity: ${item.quantity}`);
    });
  }

  // Méthode pour calculer le prix total du panier
  getTotalPrice() {
    let totalPrice = 0;
    this.items.forEach(item => {
      totalPrice += item.getTotalPrice();
    });
    return totalPrice;
  }
}

// Exemple de produits
const products = [
  new Product(1, 'Baskets', 'This is a basket', 100, 'assets/baskets.png'),
  new Product(2, 'Socks', 'This is a socks', 20, 'assets/socks.png'),
  new Product(3, 'Bag', 'This is a Bag', 50, 'assets/bag.png')
];

// Initialisation du panier d'achat
const cart = new ShoppingCart();

// Fonction pour mettre à jour l'affichage du panier
function updateCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  
  cart.items.forEach(item => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <p>${item.product.name} x ${item.quantity}</p>
      <p>Total: ${item.getTotalPrice()} $</p>
      <button class="btn btn-outline-danger btn-sm remove-from-cart">Remove</button>
    `;

    const removeBtn = cartItemDiv.querySelector('.remove-from-cart');
    removeBtn.addEventListener('click', () => {
      cart.removeItem(item.product.id);
      updateCart();
    });

    cartItemsDiv.appendChild(cartItemDiv);
  });

  // Mettre à jour le total des articles et le prix total
  document.getElementById('total-items').textContent = cart.getTotalItems();
  document.getElementById('cart-total').textContent = cart.getTotalPrice() + ' $';
}

// Fonction d'initialisation pour créer les cartes de produits et les ajouter à la page
function init() {
  const productListDiv = document.getElementById('product-list');

  products.forEach(product => {
    const productCard = product.createProductCard();
    productListDiv.appendChild(productCard);
  });

  // Bouton pour vider le panier
  const clearCartBtn = document.getElementById('clear-cart');
  clearCartBtn.addEventListener('click', () => {
    cart.items = [];
    updateCart();
  });
}

// Appel de la fonction d'initialisation au chargement de la page
window.onload = init;

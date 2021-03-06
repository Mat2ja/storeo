const layout = require('../layout');

module.exports = ({ products }) => {
    const renderedProducts = products
        .map(product => {
            return `
                <div class="column is-half is-one-quarter-widescreen">
                    <div class="card product-card">
                        <figure>
                            <img src="data:image/png;base64, ${product.image}" class='product-img'/>
                        </figure>
                        <div class="card-content">
                            <h3 class="subtitle product-title">${product.title}</h3>
                            <h5 class='subtitle is-4 product-price'>$${product.price}</h5>
                        </div>
                        <footer class="card-footer">
                            <form action="/cart/products/" method="POST">
                                <input hidden value='${product.id}' name='productId'>
                                <button class="button has-icon add-to-cart-btn">
                                    <i class="fa fa-shopping-cart"></i> Add to cart
                                </button>
                            </form>
                        </footer>
                    </div>
                </div>
            `;
        })
        .join('\n');

    return layout({
        content: `
            <section class="banner">
                <div class="container">
                    <div class="columns is-centered">
                        <img src="/images/banner.jpg" />
                    </div>
                </div>
            </section>
            
            <section>
                <div class="container">
                    <div class="columns">
                        <div class="column">
                            <div>
                                <h2 class="title text-center">Featured Items<h2>
                                <div class="columns products">
                                    ${renderedProducts}  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `
    });
};

class HomePage {
    // Selector para el campo de búsqueda
    get searchField() {
        return cy.get('#search_action');
    }

    // Selector para el botón de búsqueda
    get searchButton() {
        return cy.get('button.action.search');
    }

    // Selector para los productos
    get productItem() {
        return cy.contains('.item.product.product-item', 'Galaxy A14 4G');
    }

    // Selector para la sección de financiación
    get financingContent() {
        return cy.get('.price-content > .financing');
    }

    // Selector para el contenedor de filtros
    get filtersContainer() {
        return cy.get('.filters');
    }

    // Selector para el filtro de memoria interna
    get memoryFilter() {
        return cy.get('.memory > .filter-title');
    }

    // Selector para el filtro de precio
    get priceFilter() {
        return cy.contains('a', '$ 250.000 - $ 500.000');
    }

    // Selector para el botón "Más equipos"
    get moreProductsButton() {
        return cy.get('#moreProductsBtn');
    }

    // Selector para los productos visibles dentro del contenedor
    get visibleProducts() {
        return cy.get('.content-products').find('.product-item:visible');
    }

    // Selector para la lista de productos después de hacer scroll
    get productList() {
        return cy.get('ol.products.list.items.product-items').find('li.product-item:visible');
    }

    // Selector para el botón "Calculá tus cuotas"
    get installmentsModalButton() {
        return cy.get('#open-installments-modal');
    }

    // Selector para el selector de bancos
    get bankSelector() {
        return cy.get('#bankSelector');
    }

    // Selector para el selector de tarjetas
    get cardSelector() {
        return cy.get('#cardSelector');
    }

    // Selector para el botón "Calcular cuotas"
    get calculateButton() {
        return cy.get('#calculate_btn > .btn-primary');
    }

    // Selector para la tabla de cuotas
    get installmentsTable() {
        return cy.get('#bodyTable');
    }

    // Selector para desplegar la lista de formas de ordenar los equipos
    get sortOptions() {
        return cy.get('.toolbar-sorter');
    }

    // Selector para la opción de ordenar por "Precio - Mayor a Menor"
    get sortHighToLow() {
        return cy.get('#high_to_low');
    }

    // Selector para los precios de los productos
    get productPrice() {
        return cy.get('.price');
    }

    // Método para verificar la página principal
    verifyHomePage() {
        cy.request('/').its('status').should('eq', 200);
        cy.visit('/');
        cy.url().should('include', 'https://tiendaonline.movistar.com.ar/');
    }

    // Método para realizar la búsqueda del producto
    searchProduct(productName) {
        this.searchField.type(productName);
        this.searchButton.click();
    }

    // Método para seleccionar un producto
    selectProduct() {
        this.productItem.should('be.visible').click();
    }

    // Método para verificar la cantidad de cuotas sin interés
    verifyFinancing(minInstallments) {
        this.financingContent.invoke('text').then((text) => {
            const firstDigit = parseInt(text.trim().charAt(0));
            expect(firstDigit).to.be.at.least(minInstallments, `El número de cuotas sin interes debe ser al menos ${minInstallments}`);
        });
    }

    // Método para aplicar el filtro de memoria
    applyMemoryFilter(memorySize) {
        this.filtersContainer.click();
        this.memoryFilter.click();
        cy.contains('a', memorySize).should('be.visible').click();
    }

    // Método para aplicar el filtro de precio
    applyPriceFilter(priceRange) {
        this.filtersContainer.click();
        cy.contains('a', priceRange).should('be.visible').click();
    }

    // Método para verificar la cantidad de productos visibles
    verifyVisibleProductCount(minCount) {
        this.visibleProducts.should('be.visible').then(($products) => {
            const productCount = $products.length;
            expect(productCount).to.be.greaterThan(minCount, `La cantidad de equipos que pasaron los filtros y son visibles es de ${productCount}`);
        });
    }

    // Método para hacer scroll y revelar todos los productos
    revealAllProducts() {
        this.moreProductsButton.then($button => {
            if ($button.is(':disabled')) {
                this.visibleProducts.should('be.visible').then($products => {
                    const productCount = $products.length;
                    cy.log('Número de productos visibles:', productCount);
                });
            } else {
                cy.wrap($button).click();
                cy.window().then((win) => {
                    let initialHeight = win.document.documentElement.scrollHeight;
                    let currentHeight = initialHeight;
                    const scroll = () => {
                        cy.scrollTo('bottom', { ensureScrollable: false });
                        cy.wait(2000);
                        cy.window().then((win) => {
                            currentHeight = win.document.documentElement.scrollHeight;
                            if (currentHeight > initialHeight) {
                                initialHeight = currentHeight;
                                scroll();
                            }
                        });
                    };
                    scroll();
                });

                this.productList.should('be.visible').then($items => {
                    const visibleItemCount = $items.length;
                    cy.log('Número de elementos visibles:', visibleItemCount);
                });
            }
        });
    }

    // Método para seleccionar el tercer producto
    selectThirdProduct() {
        cy.get('li.product-item').eq(2).should('be.visible').click();
    }

    // Método para realizar el proceso de cálculo de cuotas
    calculateInstallments(bankName, cardName) {
        this.installmentsModalButton.click();
        this.bankSelector.contains(bankName).click({ force: true });
        this.cardSelector.contains(cardName).click({ force: true });
        cy.wait(1000);
        this.calculateButton.click();
        cy.wait(2000);
    }

    // Método para verificar que no hay opción de 60 cuotas para el banco y tarjeta seleccionados
    verifyNoSixtyInstallments() {
        this.installmentsTable.should('not.contain.text', '60 cuotas');
    }

    // Método para seleccionar el orden de los productos de mayor a menor precio
    sortByPriceHighToLow() {
        this.sortOptions.click();
        this.sortHighToLow.should('be.visible').click();
    }

    // Método para verificar que el precio del primer producto sea menor a $5.000.000
    verifyFirstProductPriceIsLessThan(amount) {
        cy.get('li.product-item').first().should('be.visible').click();
        this.productPrice.invoke('text').then(priceText => {
            const priceNumber = parseFloat(priceText.replace(/[^0-9]/g, ''));
            expect(priceNumber).to.be.lessThan(amount);
        });
    }
}

export default HomePage;

import HomePage from './pages/homePage';

describe('Evaluación técnica con Cypress', () => {
    const homePage = new HomePage();

    // Antes de cada caso de prueba verificamos que se pueda ingresar a la página de Movistar e ingresamos a la misma
    beforeEach(() => {
        // Verificamos que la página de Movistar responde correctamente realizando una solicitud HTTP e ingresamos a la misma.
        homePage.verifyHomePage();
    });

    // CP001 - Primer caso de prueba 
    it('Primer caso de prueba', () => {
        // Realizamos la búsqueda del equipo "A14" 
        homePage.searchProduct('A14');

        // Capturamos la pantalla después de la búsqueda
        cy.screenshot('resultados-busqueda');

        // Verificamos que el equipo "A14" exista y lo seleccionamos para ingresar al mismo
        homePage.selectProduct();

        // Verificamos si la cantidad de cuotas sin interés es de al menos 3
        homePage.verifyFinancing(3);
    });

    // CP002 - Segundo caso de prueba 
    it('Segundo caso de prueba', () => {
        // Aplicamos el filtro de Memoria Interna 128GB y verificamos que el filtro pueda aplicarse
        homePage.applyMemoryFilter('128GB');

        // Aplicamos el filtro de Precio entre $250.000 - $500.000 y verificamos que el filtro pueda aplicarse
        homePage.applyPriceFilter('$ 250.000 - $ 500.000');

        // Capturamos la pantalla después de aplicar los filtros
        cy.screenshot('filtros-aplicados');

        // Esperamos que los resultados se actualicen después de aplicar los filtros
        cy.wait(3000);

        // Realizamos lo necesario para revelar todos los productos visibles de la búsqueda
        homePage.revealAllProducts();
    });

    // CP003 - Tercer caso de prueba 
    it('Tercer caso de prueba', () => {
        // Ingresamos al tercer equipo de la lista inicial que se muestra
        homePage.selectThirdProduct();

        // Capturamos la pantalla del producto seleccionado
        cy.screenshot('producto-seleccionado');

        // Pulsamos el botón "Calculá tus cuotas" y seleccionamos opciones
        homePage.calculateInstallments('Credicoop', 'Visa');

        // Verificamos que NO tiene la opción de 60 cuotas para el banco "Credicoop" con tarjeta "Visa"
        homePage.verifyNoSixtyInstallments();
    });

    // CP004 - Cuarto caso de prueba (caso planteado por mi)
    //
    // Resultado esperado:
    // 1 - Que se pueda ingresar a la pagina
    // 2 - Que se pueda seleccionar el orden de los equipos de mayor a menor precio 
    // 3 - Que se pueda seleccionar el primer equipo y verificar que su precio sea de menor que $5.000.000
    
    // CP004 - Cuarto caso de prueba
    it('Cuarto caso de prueba', () => {
        // Desplegamos la lista de formas de ordenar los equipos
        homePage.sortByPriceHighToLow();

        // Capturamos la pantalla después de aplicar el ordenamiento
        cy.screenshot('orden-precio-mayor-a-menor');

        // Esperamos que los resultados se actualicen después de aplicar el orden
        cy.wait(3000);

        // Verificamos que el precio del primer producto sea menor a $5.000.000
        homePage.verifyFirstProductPriceIsLessThan(5000000);
    });
});

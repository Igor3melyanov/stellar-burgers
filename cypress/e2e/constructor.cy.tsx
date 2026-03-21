describe('Конструктор бургера', () => {
  const baseUrl = 'http://localhost:4000';

  const interceptApi = () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
  };

  const login = () => {
    cy.setCookie('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  };

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    interceptApi();
    cy.visit(baseUrl);
    cy.wait('@getIngredients');
    cy.wait(500);
    cy.get('[data-cy="ingredient-bun"]').should('exist');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Должен добавить булки в конструктор', () => {
      cy.get('[data-cy="ingredient-bun"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-cy="constructor-bun-top"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="constructor-bun-bottom"]', { timeout: 5000 }).should('be.visible');
    });

    it('Должен добавить начинку в конструктор', () => {
      cy.get('[data-cy="ingredient-main"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-cy="constructor-ingredient"]', { timeout: 5000 }).should('have.length.at.least', 1);
    });

    it('Должен добавить соус в конструктор', () => {
      cy.get('[data-cy="ingredient-sauce"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-cy="constructor-ingredient"]', { timeout: 5000 }).should('have.length.at.least', 1);
    });
  });

  describe('Работа с модальным окном ингредиента', () => {
    it('Должен открыть модальное окно ингредиента', () => {
      let ingredientName = '';
      
      cy.get('[data-cy="ingredient-bun"]').first().within(() => {
        cy.get('.text').first().invoke('text').then((text) => {
          ingredientName = text;
        });
        cy.get('a').click();
      });
      
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="modal-title"]').should('be.visible');
      cy.get('[data-cy="ingredient-name"]').should('contain', ingredientName);
    });

    it('Должен закрыть модальное окно по клику на крестик', () => {
      cy.get('[data-cy="ingredient-bun"]').first().within(() => {
        cy.get('a').click();
      });
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('be.visible');
      
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('not.exist');
    });

    it('Должен закрыть модальное окно по клику на оверлей', () => {
      cy.get('[data-cy="ingredient-bun"]').first().within(() => {
        cy.get('a').click();
      });
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('be.visible');
      
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      login();
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait(500);
      
      cy.get('[data-cy="ingredient-bun"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-cy="ingredient-main"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-cy="ingredient-sauce"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.wait(500);
      
      cy.get('[data-cy="constructor-bun-top"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="constructor-bun-bottom"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="constructor-ingredient"]', { timeout: 5000 }).should('have.length.at.least', 2);
    });

    it('должен успешно создать заказ', () => {
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder', { timeout: 10000 });
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('be.visible');
      
      cy.fixture('order.json').then((orderMock) => {
        const orderNumber = orderMock.order.number;
        cy.get('[data-cy="order-number"]', { timeout: 5000 }).should('contain', orderNumber);
      });
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder', { timeout: 10000 });
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('be.visible');
      
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]', { timeout: 5000 }).should('not.exist');
      
      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);
    });
  });
});
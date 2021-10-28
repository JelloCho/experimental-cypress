/// <reference types="cypress" />
// describe 훅은 block 단위로 테스트(it)를 묶는다.
// It provides a way to keep tests easier to read and organized.
describe('example to-do app', () => {
  // for preconditions 전제조건 ....
  // runs before each test in this block
  beforeEach(() => {
    cy.visit('http://localhost:8080/todo')
  })

  // 테스트 단위 ...
  it('displays two todo items by default', () => {
    cy.get('.todo-list li').should('have.length', 2)
    cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })

  it('can add new todo items', () => {
    const newItem = 'Feed the cat'

    // document.querySelector('[data-test=new-todo]');
    // A best practice is to use data-* attributes like data-cy, data-test and data-testid
    // which isolates the elements from CSS or JS changes.
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // Since assertions yield the element that was asserted on, we can chain both of these assertions together into a single statement.
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    // `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label> by traversing up the dom to the parent element.
    // From there, we can `find` the child checkbox <input> element and use the `check` command to check it.
    // parent() only travels a single level up the DOM tree as opposed to the .parents() command.
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  // context does the same as describe
  // 상위 describe 블록의 beforeEach 훅도 실행 된다. 주목!
  context('with a checked task', () => {
    beforeEach(() => {
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      cy.contains('Active').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      cy.contains('Clear completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      cy.contains('Clear completed').should('not.exist')
    })
  })
})

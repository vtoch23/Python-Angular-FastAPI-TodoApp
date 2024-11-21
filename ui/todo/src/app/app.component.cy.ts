import { mount } from 'cypress/angular';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent Component Tests', () => {
  const createConfig = (properties: { [key: string]: any }) => {
    return {
      imports: [
        AppComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      componentProperties: {
        title: '',
        tasks: [],
        newTask: "",
        ...properties,
      }
    };
  };

  beforeEach(() => {
    cy.viewport(800, 800);
  });

  it('should mount the component and display the title', () => {
    mount(AppComponent, createConfig({title:'Todo App'}));
    cy.getDataCy('app-component').should('exist');
    cy.getDataCy('app-component-title').should('have.text', 'Todo App')
  });

  describe('displays correct elements in input area', () => {

    it('should display input', () => {
      mount(AppComponent, createConfig({ tasks: [{ id: 1, task: 'Test Task1', date: new Date() }] }));
  
      cy.getDataCy('app-component-input').should('be.visible')
    });
  
    it('should display add task button', () => {
      mount(AppComponent, createConfig({ tasks: [{ id: 1, task: 'Test Task1', date: new Date() }] }));
  
      cy.getDataCy('app-component-button_add').should('be.visible')
    });
  })

  
  describe('displays correct elements in tasks table', () => {
    it('should display task', () => {
      const config = createConfig({});
      mount(AppComponent, config);
  
      cy.getDataCy('app-component-input').type('Test Task1');
      cy.getDataCy('app-component-button_add').click();
      cy.getDataCy('app-component-table').should('be.visible');
      cy.getDataCy('app-component-task').should('be.visible').and('contain.text', 'Test Task1');
    });
  
    it('should display date', () => {
      mount(AppComponent, createConfig({ tasks: [{ id: 1, task: 'Test Task1', date: new Date() }] }));
  
      cy.getDataCy('app-component-task').should('be.visible');
      cy.getDataCy('app-component-date').should('not.be.undefined')
    });

    it('should display delete button', () => {
      mount(AppComponent, createConfig({ tasks: [{ id: 1, task: 'Test Task1', date: new Date() }] }));
  
      cy.getDataCy('app-component-table').should('be.visible');
      cy.getDataCy('app-component-button_delete').should('be.visible')
    });
  })
  
  describe('functionality', () => {
    it('should display all tasks', () => {
      const config = createConfig({});
      mount(AppComponent, config);
  
      cy.getDataCy('app-component-input').type('Test Task1')
      cy.get('[data-cy="app-component-button_add"]').should('exist').click({force: true});

      cy.getDataCy('app-component-input').type('Test Task2')
      cy.get('[data-cy="app-component-button_add"]').click({force: true});

      cy.getDataCy('app-component-input').type('Test Task3')
      cy.get('[data-cy="app-component-button_add"]').click({force: true});

      cy.getDataCy('app-component-table').should('be.visible');
      cy.getDataCy('app-component-task').should('contain.text', 'Test Task1');
      cy.getDataCy('app-component-task').should('contain.text', 'Test Task2');
      cy.getDataCy('app-component-task').should('contain.text', 'Test Task3');
    });

    it('should add a new task', () => {
      mount(AppComponent, createConfig({ tasks: [] }));
  
      cy.getDataCy('app-component-input').type('Newly Added Task');
      cy.getDataCy('app-component-button_add').click();
  
      cy.getDataCy('app-component-task').should('contain.text', 'Newly Added Task');
    });
  
    it('should delete a task', () => {
      mount(AppComponent, createConfig({}));
      
      cy.getDataCy('app-component-input').type('Task to be deleted');
      cy.getDataCy('app-component-button_add').click();

      cy.getDataCy('app-component-row').contains('Task to be deleted')
        .parent()
        .find('[data-cy="app-component-button_delete"]').click();
      cy.getDataCy('app-component-task').should('not.contain', 'Task to be deleted');
    });
  });
});
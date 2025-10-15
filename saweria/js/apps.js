
// ==================== APP INITIALIZATION ====================
import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';

// Initialize MVC Application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);
    
    // Make controller globally accessible for debugging
    window.app = { model, view, controller };
    
    console.log('Application initialized successfully!');
    console.log('MVC Structure:', { model, view, controller });
});
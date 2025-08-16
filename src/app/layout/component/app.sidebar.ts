import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` 
        <div class="layout-sidebar">
            <div class="layout-sidebar-profile">
                <img src="assets/layout/images/avatar.png" alt="User Avatar" class="layout-sidebar-profile-avatar" />
                <h4 class="layout-sidebar-profile-name">Guilherme</h4>
                <span class="layout-sidebar-profile-role">Administrador</span>
            </div>
            <app-menu></app-menu>
        </div>
    `
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
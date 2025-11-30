import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    // ALTERADO: Label para 'Home' e rota para '/home'
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home'] }
                ]
            },
            {
                label: 'Experimentos',
                items: [
                    { label: 'Lista de Experimentos',  routerLink: ['/experimentos'] },
                    { label: 'Cadastro de Experimento',  routerLink: ['/cadastro-experimento'] },
                ]
            },
            {
                label: 'Participantes',
                items: [
                    { label: 'Cadastro de Participante', icon: 'pi pi-fw pi-user-plus', routerLink: ['/participantes/novo'] },
                    { label: 'Participantes', icon: 'pi pi-fw pi-users', routerLink: ['/participantes'] }
                ]
            },
            {
                label: 'Perfil',
                items: [
                    { label: 'Meu Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/perfil'] }
                ]
            },
        ];
    }
}
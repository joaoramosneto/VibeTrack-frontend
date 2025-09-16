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
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Experimentos',
                items: [
                    // LINHA ADICIONADA AQUI:
                    { label: 'Lista de Experimentos', icon: 'pi pi-fw pi-table', routerLink: ['/experimentos'] },
                    
                    { label: 'Cadastro de Experimento', icon: 'pi pi-fw pi-flask', routerLink: ['/cadastro-experimento'] },
                    { label: 'Ver Detalhes', icon: 'pi pi-fw pi-search', routerLink: ['/experimentos', '1'] }
                ]
            },
            {
                label: 'Participantes',
                items: [
                    { label: 'Cadastro de Participante', icon: 'pi pi-fw pi-user-plus', routerLink: ['/participantes/novo'] }
                ]
            },
        ];
    }
}
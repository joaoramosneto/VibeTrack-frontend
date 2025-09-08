import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';
// 1. Importa o novo nome do componente
import { ExperimentosRecentesWidget } from './components/experimentos-recentes.component';

@Component({
    selector: 'app-dashboard',
    // 2. Atualiza a lista de imports
    imports: [StatsWidget, ExperimentosRecentesWidget],
    standalone: true,
    template: `
        <div class="grid">
            <div class="col-12">
                <app-stats-widget />
            </div>
            <div class="col-12">
                <app-experimentos-recentes-widget />
            </div>
        </div>
    `
    // Eu ajustei o seu HTML com uma estrutura de grid mais comum para evitar problemas de layout.
})
export class Dashboard {}
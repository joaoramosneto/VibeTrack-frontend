import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';

@Component({
    selector: 'app-dashboard',
    // A lista de imports foi limpa para manter apenas o que é usado
    imports: [StatsWidget, RecentSalesWidget],
    standalone: true,
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />

            <div class="col-span-12">
                <app-recent-sales-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
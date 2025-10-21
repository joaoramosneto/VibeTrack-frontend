import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
                <div class="col-span-12">
            <div class="card mb-0 h-full p-6 text-center">
                                <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl">
                    Bem-vindo ao VibeTrack! 🚀
                </div>
            </div>
        </div>
    `
})
export class StatsWidget {}
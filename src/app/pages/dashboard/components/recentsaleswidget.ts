import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-recent-sales-widget',
    standalone: true,
    template: `
        <div class="card">
            <div class="flex justify-content-between align-items-center mb-5">
                <h5>Experimentos Recentes</h5>
                <div>
                    <button pButton label="Ver Todos" icon="pi pi-arrow-right" class="p-button-text"></button>
                </div>
            </div>
            <p-table [value]="products" [rows]="5" [paginator]="true" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 45%">Nome do Experimento</th>
                        <th>Participantes</th>
                        <th>Status</th>
                        <th>Emoção</th>
                        <th>Ações</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price }}</td> 
                        <td>
                            <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)"></p-tag>
                        </td>
                        <td>{{ product.category }}</td>
                        <td style="width: 15%">
                            <button pButton pRipple icon="pi pi-search" class="p-button-rounded p-button-text"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    imports: [CommonModule, TableModule, ButtonModule, TagModule],
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit {
    products!: Product[];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data));
    }

    getSeverity(status: string) {
        switch (status) {
            case 'CONCLUÍDO': return 'success';
            case 'EM ANDAMENTO': return 'warning';
            case 'PLANEJADO': return 'info';
            default: return 'secondary';
        }
    }
}
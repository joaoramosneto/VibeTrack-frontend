import { Injectable } from '@angular/core';

// Reutilizamos a interface Product para manter a compatibilidade do template
export interface Product {
    id?: string;
    code?: string;           // Código do Experimento
    name?: string;           // Nome do Experimento
    description?: string;    // Descrição
    price?: number;          // Reutilizado como: Número de Participantes
    quantity?: number;       // Reutilizado como: Duração (em minutos)
    inventoryStatus?: string;// Status do Experimento
    category?: string;       // Emoção Principal
    image?: string;          // Imagem representativa
    rating?: number;         // Relevância ou Impacto (1 a 5)
}

@Injectable()
export class ProductService {

    // Lista de dados detalhados dos experimentos
    getProductsData() {
        return [
            {
                id: '1000',
                code: 'EXP-001',
                name: 'Resposta ao Estímulo de Humor',
                description: 'Análise da resposta galvânica da pele a vídeos de comédia.',
                image: 'experiment-alegria.jpg',
                price: 50, // N° de Participantes
                category: 'Alegria',
                quantity: 60, // Duração (min)
                inventoryStatus: 'CONCLUÍDO',
                rating: 5
            },
            {
                id: '1001',
                code: 'EXP-002',
                name: 'Monitoramento de Microexpressões',
                description: 'Detecção de surpresa através de software de análise facial.',
                image: 'experiment-surpresa.jpg',
                price: 35,
                category: 'Surpresa',
                quantity: 45,
                inventoryStatus: 'EM ANDAMENTO',
                rating: 4
            },
            {
                id: '1002',
                code: 'EXP-003',
                name: 'Impacto da Música na Tristeza',
                description: 'Avaliação do estado de humor após exposição a músicas melancólicas.',
                image: 'experiment-tristeza.jpg',
                price: 25,
                category: 'Tristeza',
                quantity: 30,
                inventoryStatus: 'PLANEJADO',
                rating: 3
            },
            {
                id: '1003',
                code: 'EXP-004',
                name: 'Estudo sobre Resposta de Medo',
                description: 'Medição da frequência cardíaca em cenários de realidade virtual.',
                image: 'experiment-medo.jpg',
                price: 40,
                category: 'Medo',
                quantity: 75,
                inventoryStatus: 'EM ANDAMENTO',
                rating: 5
            },
            {
                id: '1004',
                code: 'EXP-005',
                name: 'Análise de Valência Emocional',
                description: 'Classificação de imagens como positivas, negativas ou neutras.',
                image: 'experiment-neutro.jpg',
                price: 120,
                category: 'Neutro',
                quantity: 90,
                inventoryStatus: 'CONCLUÍDO',
                rating: 4
            }
        ];
    }

    // A função getProductsSmall é a que o dashboard utiliza
    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    }

    getProducts() {
        return Promise.resolve(this.getProductsData());
    }
}
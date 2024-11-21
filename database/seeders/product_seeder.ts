import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    await Product.createMany([
      { 
        name: 'Chapeu de mago',  
        price: 20.00, 
        categoryId: 5, 
        description: 'Incrivel chapéu de mago para quem gosta de fazer cosplay.',
        imageUrl: '/images/chapeuMago.png' 
      },
      { 
        name: 'Conjunto de Dados Arcano: Cristal Azul', 
        price: 59.90, 
        categoryId: 1, 
        description: 'Um conjunto de 7 dados polidos com acabamento translúcido, perfeitos para sessões que exigem um toque de magia. Inclui D20, D12, D10, D8, D6, D4 e percentual.',
        imageUrl: '/images/dadosCristal.png' 
      },
      { 
        name: 'Torre de Dados: Dragão de Prata', 
        price: 149.90, 
        categoryId: 1, 
        description: 'Uma torre para rolar dados com design inspirado em dragões. Feita de resina durável e pintada à mão.',
        imageUrl: '/images/TorreDados.png' 
      },
      { 
        name: 'Compêndio das Terras Sombrias', 
        price: 119.90, 
        categoryId: 2, 
        description: 'Um suplemento de RPG com mapas detalhados, novos monstros e opções de classes para campanhas sombrias.',
        imageUrl: '/images/Compendio das Terras Sombrias.png' 
      },
      { 
        name: 'Guia do Mestre Épico', 
        price: 89.90, 
        categoryId: 2, 
        description: 'Um livro essencial para mestres que desejam criar aventuras memoráveis. Inclui dicas avançadas e tabelas de eventos aleatórios.',
        imageUrl: '/images/Guia mestre epico.png' 
      },
      { 
        name: 'Miniatura: Guerreiro Orc em Combate', 
        price: 39.90, 
        categoryId: 3, 
        description: 'Uma miniatura de alta qualidade representando um orc guerreiro com machado duplo. Ideal para combates intensos no tabuleiro.',
        imageUrl: '/images/Miniatura guerreiro.png' 
      },
      { 
        name: 'Miniatura: Dragão Vermelho Ancião', 
        price: 199.90, 
        categoryId: 3, 
        description: 'Um dragão detalhado e imponente, com asas abertas e escamas cintilantes. Perfeito como boss final na sua campanha.',
        imageUrl: '/images/Miniatura dragao.png' 
      },
      { 
        name: 'Caneca do Bárbaro: "Por Cerveja e Glória"', 
        price: 49.90, 
        categoryId: 4, 
        description: 'Caneca de cerâmica com capacidade para 500 ml, ilustrada com um bárbaro e seu lema de batalha.',
        imageUrl: '/images/Caneca Barbaro.png' 
      },
      { 
        name: 'Moeda de Ouro do Aventureiro', 
        price: 9.90, 
        categoryId: 4, 
        description: 'Réplica de moeda medieval, ideal para representar tesouros ou ser usada como token em mesas de RPG.',
        imageUrl: '/images/Moeda.png' 
      },
      { 
        name: 'Capa do Mago Elemental', 
        price: 229.90, 
        categoryId: 5, 
        description: 'Uma capa com bordados de símbolos elementais, feita em tecido leve e resistente, ideal para cosplays e mesas temáticas.',
        imageUrl: '/images/capa.png' 
      },
      { 
        name: 'Tiara Elfica com Cristal Verde', 
        price: 89.90, 
        categoryId: 5, 
        description: 'Acessório artesanal que combina beleza e praticidade para cosplays de elfos ou druidas.',
        imageUrl: '/images/tIara.png' 
      },
      { 
        name: 'Mapa Pergaminho: Reinos Perdidos', 
        price: 74.90, 
        categoryId: 6, 
        description: 'Um mapa impresso em papel de alta gramatura com acabamento envelhecido. Tamanho A2.',
        imageUrl: '/images/Pergaminho.png' 
      },
    ])
  }
}

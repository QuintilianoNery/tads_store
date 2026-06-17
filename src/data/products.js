// src/data/products.js — catálogo de exemplo (shape estilo DummyJSON)
// Espelha o protótipo TADS Store (offline). Estado em memória, sem API.

export const PRODUCTS = [
  { id: 1, title: 'Fones Bluetooth Pro com Cancelamento de Ruído', category: 'Eletrônicos', price: 199.9, discountPercentage: 20, rating: 4.5, stock: 34,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop',
    description: 'Áudio imersivo com cancelamento ativo de ruído, até 30h de bateria e conexão multiponto. O par perfeito para o dia a dia e viagens.' },
  { id: 2, title: 'Relógio Inteligente Series 8', category: 'Acessórios', price: 1299, discountPercentage: 0, rating: 4, stock: 12,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80&auto=format&fit=crop',
    description: 'Monitore saúde, treinos e notificações no seu pulso. Tela AMOLED sempre ativa e resistência à água.' },
  { id: 3, title: 'Tênis Esportivo Runner Air', category: 'Calçados', price: 329.9, discountPercentage: 28, rating: 5, stock: 47,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    description: 'Amortecimento responsivo e cabedal em malha respirável. Leveza para correr mais longe, todos os dias.' },
  { id: 4, title: 'Câmera Mirrorless 24MP Kit Lente', category: 'Eletrônicos', price: 4499, discountPercentage: 10, rating: 4.5, stock: 6,
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80&auto=format&fit=crop',
    description: 'Sensor APS-C de 24MP, vídeo 4K e estabilização. Acompanha lente 18-55mm para começar a criar.' },
  { id: 5, title: 'Óculos de Sol Aviador Polarizado', category: 'Acessórios', price: 149.9, discountPercentage: 0, rating: 4, stock: 80,
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop',
    description: 'Proteção UV400 com lentes polarizadas e armação leve em metal. Estilo clássico que combina com tudo.' },
  { id: 6, title: 'Mochila Antifurto para Notebook', category: 'Acessórios', price: 219.9, discountPercentage: 15, rating: 4.5, stock: 23,
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop',
    description: 'Compartimento acolchoado para notebook 15", porta USB externa e zíperes ocultos. Segura e organizada.' },
  { id: 7, title: 'Teclado Mecânico Sem Fio RGB', category: 'Eletrônicos', price: 389, discountPercentage: 0, rating: 5, stock: 18,
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80&auto=format&fit=crop',
    description: 'Switches mecânicos, iluminação RGB e conexão Bluetooth tripla. Digitação precisa com toque premium.' },
  { id: 8, title: 'Jaqueta Corta-Vento Impermeável', category: 'Moda', price: 259.9, discountPercentage: 22, rating: 4, stock: 41,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop',
    description: 'Tecido leve e impermeável com capuz ajustável. Proteção contra vento e chuva sem perder mobilidade.' },
];

export const CATEGORIES = ['Todos', 'Eletrônicos', 'Acessórios', 'Calçados', 'Moda'];

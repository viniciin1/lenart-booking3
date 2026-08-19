/**
 * Catálogo de serviços – fonte única de verdade partilhada
 * pela secção de Serviços e pelo fluxo de marcação.
 */
export const SERVICES = [
  {
    id: 'gel-polish',
    name: 'Verniz em Gel',
    tagline: 'Cor brilhante que dura',
    description: 'Verniz em gel de remoção por imersão sobre unhas naturais. Acabamento resistente e brilhante que dura até 3 semanas.',
    duration: 60,
    price: 15,
    category: 'gel-polish',
    popular: false,
    gradient: 'linear-gradient(135deg, #EEEAF8 0%, #DDD8F0 100%)',
    accentColor: '#9B8DC8',
  },
  {
    id: 'first-application-small-medium',
    name: 'Primeira Aplicação',
    tagline: 'Unhas pequenas e médias',
    description: 'Primeira aplicação de gel para unhas pequenas e médias. Inclui preparação, forma, cor à escolha e acabamento.',
    duration: 75,
    price: 30,
    category: 'first-application',
    popular: false,
    gradient: 'linear-gradient(135deg, #FAF0E6 0%, #F0DEC8 100%)',
    accentColor: '#C9A96E',
  },
  {
    id: 'first-application-big',
    name: 'Primeira Aplicação',
    tagline: 'Unhas grandes',
    description: 'Primeira aplicação de gel para unhas grandes. Inclui preparação, forma, cor à escolha e acabamento.',
    duration: 90,
    price: 40,
    category: 'first-application',
    popular: false,
    gradient: 'linear-gradient(135deg, #EDF7EF 0%, #CCE8D1 100%)',
    accentColor: '#4A9E6A',
  },
  {
    id: 'maintenance-small-medium',
    name: 'Manutenção',
    tagline: 'Unhas pequenas e médias',
    description: 'Manutenção de gel para unhas pequenas e médias. Inclui remoção do crescimento, reforço, cor à escolha e acabamento.',
    duration: 60,
    price: 22,
    category: 'maintenance',
    popular: false,
    gradient: 'linear-gradient(135deg, #FBE8E6 0%, #F5D0CE 100%)',
    accentColor: '#E09F9C',
  },
  {
    id: 'maintenance-big',
    name: 'Manutenção',
    tagline: 'Unhas grandes',
    description: 'Manutenção de gel para unhas grandes. Inclui remoção do crescimento, reforço, cor à escolha e acabamento.',
    duration: 75,
    price: 26,
    category: 'maintenance',
    popular: false,
    gradient: 'linear-gradient(135deg, #FAF0E6 0%, #F0DEC8 100%)',
    accentColor: '#C9A96E',
  },
]

/**
 * Extras / add-ons
 */
export const EXTRAS = [
  {
    id: 'broken-nail',
    name: 'Unha Partida',
    description: 'Reparação de uma unha partida ou danificada.',
    price: 1.50,
    priceLabel: '€1,50 / unha',
    icon: '💅',
  },
  {
    id: 'nail-art-3d',
    name: 'Nail Art 3D',
    description: 'Decoração 3D personalizada — preço sob consulta.',
    price: 0,
    priceLabel: 'Sob consulta',
    icon: '✨',
    noQty: true,
  },
  {
    id: 'baby-boomer',
    name: 'Baby Boomer',
    description: 'Efeito degradé entre branco e rosa suave.',
    price: 5,
    priceLabel: '€5,00',
    icon: '🌸',
  },
  {
    id: 'francesa',
    name: 'Francesa',
    description: 'Clássica ponta branca com acabamento elegante.',
    price: 5,
    priceLabel: '€5,00',
    icon: '🤍',
  },
  {
    id: 'blooming-gel',
    name: 'Blooming Gel',
    description: 'Efeito floral aquoso criado com gel especial.',
    price: 5,
    priceLabel: '€5,00',
    icon: '🌺',
  },
  {
    id: 'encapsulada',
    name: 'Encapsulada',
    description: 'Elementos decorativos encapsulados dentro da unha.',
    price: 5,
    priceLabel: '€5,00',
    icon: '💎',
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye',
    description: 'Efeito magnético que cria um brilho felino.',
    price: 3.50,
    priceLabel: '€3,50',
    icon: '🐱',
  },
  {
    id: 'nail-art-simples',
    name: 'Nail Art Simples',
    description: '1 nail art simples por mão — incluída gratuitamente.',
    price: 0,
    priceLabel: 'Oferta',
    icon: '🎁',
    noQty: true,
    free: true,
  },
]

export function getServiceById(id) {
  return SERVICES.find(s => s.id === id) ?? null
}

export function getExtraById(id) {
  return EXTRAS.find(e => e.id === id) ?? null
}

export function formatDuration(_minutes) {
  return '1h+'
}

export function calcTotal(service, extras) {
  const extrasTotal = extras.reduce((sum, e) => sum + (e.price * (e.qty ?? 1)), 0)
  return (service?.price ?? 0) + extrasTotal
}

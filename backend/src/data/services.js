/**
 * Catálogo de serviços – espelha frontend/src/lib/services.js.
 */
export const SERVICES = [
  { id: 'gel-polish',                     name: 'Verniz em Gel',                        price: 15, duration: 60 },
  { id: 'first-application-small-medium', name: 'Primeira Aplicação – Pequena e Média', price: 30, duration: 75 },
  { id: 'first-application-big',          name: 'Primeira Aplicação – Grande',           price: 40, duration: 90 },
  { id: 'maintenance-small-medium',       name: 'Manutenção – Pequena e Média',          price: 22, duration: 60 },
  { id: 'maintenance-big',                name: 'Manutenção – Grande',                   price: 26, duration: 75 },
]

export function getService(id) {
  return SERVICES.find(s => s.id === id) ?? null
}

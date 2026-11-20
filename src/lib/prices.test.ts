import { expect, test } from "bun:test";

import {
  flavorPrices,
  gourmetFlavors,
  pizzas,
  sweetFlavors,
  sweetPizzas,
  traditionalFlavors,
} from "@/lib/brandi";

// Tabela enviada pelo dono da pizzaria:
// [chave na tabela de sabores, Famiglia (8 pedaços), Una Persna (4 pedaços)]
const TABLE: [string, number, number][] = [
  ["5 Queijos", 115, 69],
  ["Atum", 88.5, 53.1],
  ["Bambino", 80, 48],
  ["Bela", 65, 39],
  ["Bologna", 115, 69],
  ["Brandi", 110, 66],
  ["Calabresa", 85, 51],
  ["Calábria", 95, 57],
  ["Pompéia", 90, 54],
  ["Escarola", 95, 57],
  ["Florença", 95, 57],
  ["Grega", 95, 57],
  ["Japonesa", 100, 60],
  ["Margherita", 88.5, 53.1],
  ["Milano", 95, 57],
  ["Milho Verde", 88.5, 53.1],
  ["Mozzarella", 85, 51],
  ["Napolitana", 95, 57],
  ["Palermo", 110, 66],
  ["Palmito", 93, 55.8],
  ["Paris", 115, 69],
  ["Passione", 65, 39],
  ["Pisa", 115, 69],
  ["Portuguesa", 95, 57],
  ["Pralina", 65, 39],
  ["Quattro Stagioni", 100, 60],
  ["Ravena", 110, 66],
  ["Romana", 100, 60],
  ["Sensazione", 65, 39],
  ["Siena", 65, 39],
  ["Toscana", 95, 57],
  ["Veneza", 110, 66],
  ["Verona", 69, 41.4],
  ["Via Appia", 110, 66],
  ["Zucchini", 95, 57],
  ["Catupiry", 88, 52.8],
  ["Capri", 110, 66],
];

// a antiga Calzone virou Pompéia: as duas saem pelo mesmo preço
const CALZONE_PRICE = 90;
const CALZONE_PRICE_SMALL = 54;

function brl(value: number) {
  // o formatador pt-BR usa espaço insubstituível entre "R$" e o número
  return value
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");
}

test("a tabela de preços traz os dois tamanhos de cada pizza do cardápio", () => {
  for (const [name, large, small] of TABLE) {
    const row = flavorPrices[name];
    expect(row, `faltando preços de ${name}`).toBeDefined();
    if (!row) continue;
    expect(row["Famiglia"], `${name} Famiglia`).toBe(large);
    expect(row["Una Persna"], `${name} Una Persna`).toBe(small);
  }
});

test("a antiga Calzone custa o mesmo que a Pompéia", () => {
  const calzone = flavorPrices["Calzone"];
  expect(calzone).toBeDefined();
  expect(calzone?.["Famiglia"]).toBe(CALZONE_PRICE);
  expect(calzone?.["Una Persna"]).toBe(CALZONE_PRICE_SMALL);
});

test("todo sabor listado no site tem os dois preços na tabela", () => {
  const listed = [
    ...traditionalFlavors,
    ...gourmetFlavors,
    ...sweetFlavors,
  ].map((f) => f.name);
  expect(listed.length).toBe(35);
  for (const name of listed) {
    const row = flavorPrices[name];
    expect(row, `${name} sem preços`).toBeDefined();
    expect(row?.["Famiglia"]).toBeGreaterThan(0);
    expect(row?.["Una Persna"]).toBeGreaterThan(0);
  }
});

test("as pizzas do cardápio mostram os dois tamanhos com os valores certos", () => {
  const byFlavor = new Map(TABLE.map(([name, large, small]) => [name, { large, small }]));
  byFlavor.set("Calzone", { large: CALZONE_PRICE, small: CALZONE_PRICE_SMALL });

  const menu = [...pizzas, ...sweetPizzas];
  expect(menu.length).toBe(10);

  for (const pizza of menu) {
    // o cardápio escreve os nomes em maiúsculas e com acentos: VIA ÁPPIA -> Via Appia
    const key = TABLE.map(([n]) => n).find(
      (n) =>
        n
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase() ===
        pizza.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase(),
    );
    const expected = key ? byFlavor.get(key) : undefined;
    expect(expected, `${pizza.name} não está na tabela`).toBeDefined();
    if (!expected) continue;
    expect(pizza.price, `${pizza.name} Famiglia`).toBe(brl(expected.large));
    expect(pizza.priceSmall, `${pizza.name} Una Persna`).toBe(
      brl(expected.small),
    );
  }
});

test("nenhum tamanho antigo aparece no cardápio", () => {
  const text = JSON.stringify([...pizzas, ...sweetPizzas]);
  expect(text.includes("Média")).toBe(false);
  expect(text.includes("Família")).toBe(false);
});

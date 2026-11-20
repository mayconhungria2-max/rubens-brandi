import { expect, test } from "bun:test";

import { flavorPrices, pizzas, sweetPizzas } from "@/lib/brandi";

// Valores informados pelo dono da pizzaria: pequena = Una Persna (4 pedaços),
// grande = Famiglia (8 pedaços).
const menuPrices: Record<string, { small: string; large: string }> = {
  PISA: { small: "R$ 69,00", large: "R$ 115,00" },
  VENEZA: { small: "R$ 66,00", large: "R$ 110,00" },
  "VIA ÁPPIA": { small: "R$ 66,00", large: "R$ 110,00" },
  ZUCCHINI: { small: "R$ 57,00", large: "R$ 95,00" },
  BRANDI: { small: "R$ 66,00", large: "R$ 110,00" },
  GREGA: { small: "R$ 57,00", large: "R$ 95,00" },
  MARGHERITA: { small: "R$ 53,10", large: "R$ 88,50" },
  PALERMO: { small: "R$ 66,00", large: "R$ 110,00" },
  PARIS: { small: "R$ 69,00", large: "R$ 115,00" },
  BELA: { small: "R$ 39,00", large: "R$ 65,00" },
};

// nome no cardápio -> chave da tabela de sabores (src/lib/brandi.ts)
const flavorKey: Record<string, string> = {
  PISA: "Pisa",
  VENEZA: "Veneza",
  "VIA ÁPPIA": "Via Appia",
  ZUCCHINI: "Zucchini",
  BRANDI: "Brandi",
  GREGA: "Grega",
  MARGHERITA: "Margherita",
  PALERMO: "Palermo",
  PARIS: "Paris",
  BELA: "Bela",
};

const menu = [...pizzas, ...sweetPizzas];

test("cada pizza do cardápio traz os dois tamanhos com os valores certos", () => {
  for (const pizza of menu) {
    const expected = menuPrices[pizza.name];
    expect(expected).toBeDefined();
    if (!expected) continue;
    expect(pizza.price).toBe(expected.large);
    expect(pizza.priceSmall).toBe(expected.small);
  }
});

test("os dois tamanhos batem com a tabela de sabores", () => {
  for (const pizza of menu) {
    const expected = menuPrices[pizza.name];
    const key = flavorKey[pizza.name];
    if (!expected || !key) continue;
    const table = flavorPrices[key];
    expect(table).toBeDefined();
    if (!table) continue;
    expect(table["Famiglia"]).toBe(Number(expected.large.replace("R$ ", "").replace(",", ".")));
    expect(table["Una Persna"]).toBe(
      Number(expected.small.replace("R$ ", "").replace(",", ".")),
    );
  }
});

test("nenhum tamanho antigo aparece no cardápio", () => {
  const text = JSON.stringify(menu);
  expect(text.includes("Média")).toBe(false);
  expect(text.includes("Família")).toBe(false);
});

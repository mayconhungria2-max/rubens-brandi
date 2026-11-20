import { expect, test } from "bun:test";

import {
  gourmetPizzas,
  pizzas,
  savoryPizzas,
  sweetPizzas,
} from "@/lib/brandi";

// categorias que o dono da pizzaria definiu para o cardápio
const GOURMET = ["BRANDI", "GREGA", "PALERMO", "PARIS", "VENEZA", "ZUCCHINI"];
const SALGADAS = ["MARGHERITA", "PISA", "VIA ÁPPIA"];
const DOCES = ["BELA"];

const up = (list: { name: string }[]) =>
  list
    .map((p) =>
      p.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase(),
    )
    .sort();

test("o cardápio tem a categoria gourmet com exatamente essas pizzas", () => {
  expect(gourmetPizzas.map((p) => p.name)).toEqual(GOURMET);
});

test("as pizzas salgadas são as que não são gourmet nem doces", () => {
  expect(up(savoryPizzas)).toEqual(up(SALGADAS.map((name) => ({ name }))));
});

test("a categoria de pizzas doces continua só com a Bela", () => {
  expect(up(sweetPizzas)).toEqual(up(DOCES.map((name) => ({ name }))));
});

test("nenhuma pizza aparece em duas categorias e todas aparecem em uma", () => {
  const grouped = [...savoryPizzas, ...gourmetPizzas, ...sweetPizzas];
  expect(grouped.length).toBe(pizzas.length + sweetPizzas.length);
  expect(new Set(grouped.map((p) => p.name)).size).toBe(grouped.length);
});

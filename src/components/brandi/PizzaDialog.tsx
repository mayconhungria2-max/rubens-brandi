import { Plus } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { normalizeName, pizzaLink, type Pizza } from "@/lib/brandi";
import { parseBRL, useCart } from "@/lib/cart";

export function PizzaDialog({
  pizza,
  onClose,
}: {
  pizza: Pizza | null;
  onClose: () => void;
}) {
  const { add } = useCart();

  const sizes = pizza
    ? [
        { name: "Una Persna", detail: "4 pedaços", price: pizza.priceSmall },
        { name: "Famiglia", detail: "8 pedaços", price: pizza.price },
      ]
    : [];

  return (
    <Dialog open={!!pizza} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-none border-border bg-card p-0">
        {pizza && (
          <div className="grid gap-0 sm:grid-cols-2">
            <img
              src={pizza.image}
              alt={`Pizza ${pizza.name}`}
              loading="lazy"
              className="h-56 w-full object-cover sm:h-full"
            />
            <div className="flex flex-col justify-center gap-4 p-7">
              <span className="eyebrow text-forest-light">
                {pizza.sweet ? "Pizza doce" : "Pizza salgada"}
              </span>
              <h3 className="text-3xl font-semibold tracking-wide text-brand-red">
                {pizza.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pizza.description}
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-serif text-2xl text-forest">{pizza.price}</p>
                <p className="text-[0.55rem] tracking-[0.14em] text-forest-light uppercase">
                  Famiglia · 8 pedaços
                </p>
                <p className="text-[0.68rem] tracking-[0.08em] text-forest-light uppercase">
                  Una Persna · 4 pedaços — {pizza.priceSmall}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() =>
                      add({
                        id: `${normalizeName(pizza.name)}-${s.name}`,
                        name: `Pizza ${pizza.name}`,
                        detail: s.name,
                        unitPrice: parseBRL(s.price),
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-[0.68rem] font-medium tracking-[0.1em] text-forest uppercase transition-colors hover:border-brand-red hover:bg-brand-red hover:text-primary-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" /> {s.name} · {s.detail} —{" "}
                    {s.price}
                  </button>
                ))}
              </div>
              <a
                href={pizzaLink(pizza.name)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-brand-red px-6 py-3 text-xs font-medium tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-brand-red-dark"
              >
                Pedir essa pizza
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

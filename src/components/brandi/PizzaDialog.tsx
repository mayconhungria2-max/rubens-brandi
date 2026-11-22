import { ArrowLeft, Plus } from "lucide-react";

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
          <div className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] gap-0 sm:grid-cols-2 sm:grid-rows-[minmax(0,1fr)]">
            <img
              src={pizza.image}
              alt={`Pizza ${pizza.name}`}
              loading="lazy"
              className="h-56 w-full object-cover sm:h-full"
            />
            <div className="flex min-h-0 flex-col overflow-y-auto p-7">
              <div className="m-auto flex w-full flex-col gap-4">
              <span className="eyebrow text-forest-light">
                {pizza.sweet ? "Pizza doce" : "Pizza salgada"}
              </span>
              <h3 className="text-3xl font-semibold tracking-wide text-brand-red">
                {pizza.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pizza.description}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-label={`Adicionar ${pizza.name} ${s.name}, ${s.detail}, ${s.price} ao pedido`}
                    onClick={() =>
                      add({
                        id: `${normalizeName(pizza.name)}-${s.name}`,
                        name: `Pizza ${pizza.name}`,
                        detail: s.name,
                        unitPrice: parseBRL(s.price),
                      })
                    }
                    className="flex min-w-0 flex-col items-center justify-center gap-1 border border-border bg-background px-2 py-3 text-center text-forest transition-colors hover:border-brand-red hover:bg-brand-red hover:text-primary-foreground"
                  >
                    <span className="flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.12em] uppercase">
                      <Plus className="h-3.5 w-3.5 shrink-0" /> {s.name}
                    </span>
                    <span className="text-[0.62rem] tracking-[0.04em] opacity-75">
                      {s.detail}
                    </span>
                    <span className="font-serif text-lg tracking-normal whitespace-nowrap">
                      {s.price}
                    </span>
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
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-[0.68rem] font-medium tracking-[0.14em] text-forest uppercase transition-colors hover:border-forest hover:bg-forest hover:text-primary-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar
              </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

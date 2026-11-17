import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const catalogSchema = z.object({
  title: z.string(),
  crew: z.array(z.object({ id: z.string(), name: z.string() })),
  rooms: z.array(z.object({ id: z.string(), label: z.string() })),
});

export type HouseCatalog = z.infer<typeof catalogSchema>;

export const getHouseCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { crew } = await import("@/lib/crew");
  return catalogSchema.parse({
    title: "Mansão R6",
    crew: crew.map((person) => ({ id: person.id, name: person.name })),
    rooms: [
      { id: "geral", label: "Visão geral" },
      { id: "consoles", label: "Jogos" },
      { id: "lounge", label: "Lounge" },
    ],
  });
});

export const houseCatalogQuery = queryOptions({
  queryKey: ["house-catalog"],
  queryFn: () => getHouseCatalog(),
});

export function useHouseCatalog() {
  return useQuery(houseCatalogQuery);
}

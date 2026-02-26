import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type Call } from "@shared/routes";

export function useCalls() {
  return useQuery({
    queryKey: [api.calls.list.path],
    queryFn: async () => {
      const res = await fetch(api.calls.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch calls");
      const data = await res.json();
      return api.calls.list.responses[200].parse(data) as Call[];
    },
  });
}

export function useCall(id: number | null) {
  return useQuery({
    queryKey: [api.calls.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.calls.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch call details");
      const data = await res.json();
      return api.calls.get.responses[200].parse(data) as Call;
    },
    enabled: !!id,
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ministry } from "@/types/ministry";

const API_URL = "https://c3ed-190-166-138-34.ngrok-free.app/api/ministries";

export const useMinistries = () => {
  return useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los ministerios");
      return response.json() as Promise<Ministry[]>;
    },
  });
};

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ministry: Partial<Ministry>) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ministry),
      });
      if (!response.ok) throw new Error("Error al crear el ministerio");
      return response.json() as Promise<Ministry>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Ministry> }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar el ministerio");
      return response.json() as Promise<Ministry>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

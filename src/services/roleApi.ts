
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Role } from "@/types/role";

const API_URL = "https://c3ed-190-166-138-34.ngrok-free.app/api/roles";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los roles");
      return response.json() as Promise<Role[]>;
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (role: Partial<Role>) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role),
      });
      if (!response.ok) throw new Error("Error al crear el rol");
      return response.json() as Promise<Role>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Role> }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar el rol");
      return response.json() as Promise<Role>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

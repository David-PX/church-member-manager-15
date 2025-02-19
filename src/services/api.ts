
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Member } from "@/types/member";

const API_URL = "https://localhost:7160/api/members";

export const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los miembros");
      return response.json() as Promise<Member[]>;
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (member: Partial<Member>) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error("Error al crear el miembro");
      return response.json() as Promise<Member>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar el miembro");
      return response.json() as Promise<Member>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useMembersCount = () => {
  return useQuery({
    queryKey: ["members-count"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/count`);
      if (!response.ok) throw new Error("Error al obtener el conteo de miembros");
      return response.json() as Promise<number>;
    },
  });
};

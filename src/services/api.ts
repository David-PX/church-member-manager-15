import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Member } from "@/types/member";

const API_URL = "https://localhost:7160/api/members"; 

export const fetchMembers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener los miembros");
  return response.json();
};

export const fetchMemberById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener el miembro");
  return response.json();
};

export const createMember = async (member: Partial<Member>) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!response.ok) throw new Error("Error al crear el miembro");
  return response.json();
};

export const updateMember = async (id: string, updatedMember: Partial<Member>) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedMember),
  });
  if (!response.ok) throw new Error("Error al actualizar el miembro");
  return response.json();
};

export const deleteMember = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el miembro");
  return response.json();
};


export type MemberRole = "Pastor" | "Lider" | "Miembro" | "Visitante";
export type GroupName = "Jovenes" | "Adoración" | "Niños" | "Caballeros" | "Damas" | "Adolescentes";

export interface Member {
  id: string;
  names: string;
  lastNames: string;
  image: string;
  role: MemberRole;
  minister: GroupName;
  address: string;
  email: string;
  phone: string;
  baptized: boolean;
}

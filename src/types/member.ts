
export type MemberRole = "Pastor" | "Elder" | "Deacon" | "Member" | "Visitor";
export type GroupName = "Youth" | "Worship" | "Children" | "Adults" | "Seniors";

export interface Member {
  id: string;
  name: string;
  image: string;
  role: MemberRole;
  group: GroupName;
  address: string;
  email: string;
  phone: string;
  isBaptized: boolean;
}

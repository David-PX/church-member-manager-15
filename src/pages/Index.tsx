
import { useState } from "react";
import { Member, GroupName, MemberRole } from "@/types/member";
import { MemberForm } from "@/components/MemberForm";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, Pencil, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Juan Pérez",
    role: "Pastor",
    group: "Adults",
    address: "Calle Iglesia 123, Ciudad",
    email: "juan@iglesia.com",
    phone: "(555) 123-4567",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    isBaptized: true,
  },
];

const Index = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<GroupName | "all">("all");
  const [filterRole, setFilterRole] = useState<MemberRole | "all">("all");
  const [filterBaptism, setFilterBaptism] = useState<"all" | "yes" | "no">("all");
  const { toast } = useToast();

  const handleAddMember = (newMember: Partial<Member>) => {
    const member = {
      ...newMember,
      id: Date.now().toString(),
    } as Member;
    setMembers([...members, member]);
    toast({
      title: "Éxito",
      description: "Miembro agregado exitosamente",
    });
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleUpdateMember = (updatedMember: Partial<Member>) => {
    setMembers(
      members.map((m) => (m.id === selectedMember?.id ? { ...m, ...updatedMember } : m))
    );
    toast({
      title: "Éxito",
      description: "Miembro actualizado exitosamente",
    });
  };

  const filteredMembers = members.filter((member) => {
    const matchesGroup = filterGroup === "all" || member.group === filterGroup;
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesBaptism = 
      filterBaptism === "all" || 
      (filterBaptism === "yes" && member.isBaptized) || 
      (filterBaptism === "no" && !member.isBaptized);
    return matchesGroup && matchesRole && matchesBaptism;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Miembros de la Iglesia</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Miembro
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <Select value={filterGroup} onValueChange={(value: GroupName | "all") => setFilterGroup(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Grupos</SelectItem>
              {["Youth", "Worship", "Children", "Adults", "Seniors"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group === "Youth" ? "Jóvenes" :
                    group === "Worship" ? "Alabanza" :
                    group === "Children" ? "Niños" :
                    group === "Adults" ? "Adultos" :
                    "Adultos Mayores"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterRole} onValueChange={(value: MemberRole | "all") => setFilterRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Roles</SelectItem>
              {["Pastor", "Elder", "Deacon", "Member", "Visitor"].map((role) => (
                <SelectItem key={role} value={role}>
                  {role === "Pastor" ? "Pastor" :
                    role === "Elder" ? "Anciano" :
                    role === "Deacon" ? "Diácono" :
                    role === "Member" ? "Miembro" :
                    "Visitante"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterBaptism} onValueChange={(value: "all" | "yes" | "no") => setFilterBaptism(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Bautismo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Miembros</SelectItem>
              <SelectItem value="yes">Bautizados</SelectItem>
              <SelectItem value="no">No Bautizados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Bautizado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {member.role === "Pastor" ? "Pastor" :
                    member.role === "Elder" ? "Anciano" :
                    member.role === "Deacon" ? "Diácono" :
                    member.role === "Member" ? "Miembro" :
                    "Visitante"}
                </TableCell>
                <TableCell>
                  {member.group === "Youth" ? "Jóvenes" :
                    member.group === "Worship" ? "Alabanza" :
                    member.group === "Children" ? "Niños" :
                    member.group === "Adults" ? "Adultos" :
                    "Adultos Mayores"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{member.email}</span>
                    <span className="text-sm text-muted-foreground">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  {member.isBaptized ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditMember(member)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MemberForm
        member={selectedMember}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMember(undefined);
        }}
        onSave={selectedMember ? handleUpdateMember : handleAddMember}
      />
    </div>
  );
};

export default Index;

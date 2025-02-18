
import { useEffect, useState } from "react";
import { Member, GroupName, MemberRole } from "@/types/member";
import { MemberForm } from "@/components/MemberForm";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, Pencil, Check, X, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createMember, fetchMembers, updateMember } from "@/services/api";


const Index = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<GroupName | "all">("all");
  const [filterRole, setFilterRole] = useState<MemberRole | "all">("all");
  const [filterBaptism, setFilterBaptism] = useState<"all" | "yes" | "no">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchMembers();
      console.log(data);
      setMembers(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudieron cargar los miembros" });
    }
  };

  const handleAddMember = async (newMember: Partial<Member>) => {
    try {
      const addedMember = await createMember(newMember);
      setMembers([...members, addedMember]);
      toast({ title: "Éxito", description: "Miembro agregado exitosamente" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo agregar el miembro" });
    }
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleUpdateMember = async (updatedMember: Partial<Member>) => {
    if (!selectedMember) return;
    try {
      const updated = await updateMember(selectedMember.id, updatedMember);
      setMembers(members.map((m) => (m.id === selectedMember.id ? updated : m)));
      toast({ title: "Éxito", description: "Miembro actualizado exitosamente" });
      setIsFormOpen(false);
      setSelectedMember(undefined);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo actualizar el miembro" });
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.names.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === "all" || member.minister === filterGroup;
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesBaptism = 
      filterBaptism === "all" || 
      (filterBaptism === "yes" && member.baptized) || 
      (filterBaptism === "no" && !member.baptized);
    return matchesSearch && matchesGroup && matchesRole && matchesBaptism;
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

      <div className="flex items-center justify-between mb-6 bg-white">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-48 ">
            <Select value={filterGroup} onValueChange={(value: GroupName | "all") => setFilterGroup(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Grupo" />
              </SelectTrigger>
              <SelectContent className="z-[9999] " position="popper">
                <SelectItem value="all" className="fixed">Todos los Grupos</SelectItem>
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
      </div>

      <div className="rounded-md border">
        <Table className="">
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
                      <AvatarImage src={member.image} alt={member.names} />
                      <AvatarFallback>{member.names.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.names}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {member.role ?? "Amigo"}
                </TableCell>
                <TableCell>
                  {member.minister ?? "Amigos"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{member.email}</span>
                    <span className="text-sm text-muted-foreground">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  {member.baptized ? (
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

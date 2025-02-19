
import { useState } from "react";
import { Member, Minister, MemberRole } from "@/types/member";
import { MemberForm } from "@/components/MemberForm";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, Pencil, Check, X, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { useMembers, useCreateMember, useUpdateMember, useMembersCount } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<Minister | "all">("all");
  const [filterRole, setFilterRole] = useState<MemberRole | "all">("all");
  const [filterBaptism, setFilterBaptism] = useState<"all" | "yes" | "no">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: members = [], isLoading } = useMembers();
  const { data: totalMembers = 0 } = useMembersCount();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const handleAddMember = async (newMember: Partial<Member>) => {
    try {
      await createMember.mutateAsync(newMember);
      toast({
        title: "Éxito",
        description: "Miembro agregado exitosamente",
        variant: "destructive", // Si tu configuración de ShadCN lo soporta
        className: "bg-green-500 text-white border-green-700 shadow-lg",
      });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleUpdateMember = async (updatedMember: Partial<Member>) => {
    if (!selectedMember) return;
    try {
      await updateMember.mutateAsync({
        id: selectedMember.id,
        data: updatedMember,
      });
      toast({
        title: "Éxito",
        description: "Miembro editado exitosamente",
        variant: "destructive", // Si tu configuración de ShadCN lo soporta
        className: "bg-blue-500 text-white border-green-700 shadow-lg",
      });
      setIsFormOpen(false);
      setSelectedMember(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el miembro",
        variant: "destructive",
      });
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
        <Card>
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-center text-lg font-medium">
              Total de Miembros
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <p className="text-3xl font-bold text-center">{totalMembers}</p>
          </CardContent>
        </Card>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Miembro
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
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
          <div className="w-48">
            <Select value={filterGroup} onValueChange={(value: Minister | "all") => setFilterGroup(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Ministerio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Ministerios</SelectItem>
                {["Jovenes", "Adoración", "Niños", "Caballeros", "Damas", "Adolescentes"].map((group) => (
                  <SelectItem key={group} value={group as Minister}>{group}</SelectItem>
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
                {["Pastor", "Lider", "Miembro", "Visitante"].map((role) => (
                  <SelectItem key={role} value={role as MemberRole}>{role}</SelectItem>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Cargando miembros...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No se encontraron miembros
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
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
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.minister}</TableCell>
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
              ))
            )}
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

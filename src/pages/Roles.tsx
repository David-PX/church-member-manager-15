
import { useState } from "react";
import { Role } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoles, useCreateRole, useUpdateRole } from "@/services/roleApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Users } from "lucide-react";

const RoleDialog = ({ 
  role, 
  open, 
  onOpenChange, 
  onSave 
}: { 
  role?: Role; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (data: Partial<Role>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Role>>(role || {
    name: "",
    description: "",
    permissions: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {role ? "Editar Rol" : "Nuevo Rol"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permissions">Permisos (separados por coma)</Label>
            <Input
              id="permissions"
              value={formData.permissions?.join(", ")}
              onChange={(e) => setFormData({ 
                ...formData, 
                permissions: e.target.value.split(",").map(p => p.trim()).filter(Boolean)
              })}
            />
          </div>
          <Button type="submit" className="w-full">
            {role ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: roles = [], isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const handleAddRole = async (data: Partial<Role>) => {
    try {
      await createRole.mutateAsync(data);
      toast({
        title: "Éxito",
        description: "Rol creado exitosamente",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (data: Partial<Role>) => {
    if (!selectedRole) return;
    try {
      await updateRole.mutateAsync({
        id: selectedRole.id,
        data,
      });
      toast({
        title: "Éxito",
        description: "Rol actualizado exitosamente",
      });
      setIsDialogOpen(false);
      setSelectedRole(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Roles</h1>
        </div>
        <Card>
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-center text-lg font-medium">
              Total de Roles: {roles.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Button onClick={() => {
          setSelectedRole(undefined);
          setIsDialogOpen(true);
        }}>
          Agregar Rol
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Cargando roles...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No hay roles registrados
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.permissions.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDialogOpen(true);
                      }}
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

      <RoleDialog
        role={selectedRole}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={selectedRole ? handleUpdateRole : handleAddRole}
      />
    </div>
  );
};

export default Roles;

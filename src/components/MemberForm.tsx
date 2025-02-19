
import { Member, MemberRole, GroupName } from "@/types/member";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState } from "react";

interface MemberFormProps {
  member?: Member;
  open: boolean;
  onClose: () => void;
  onSave: (member: Partial<Member>) => void;
}

const roles: MemberRole[] = ["Pastor" ,"Lider" , "Miembro" , "Visitante"];
const groups: GroupName[] = ["Jovenes" , "Adoración" , "Niños" , "Caballeros" , "Damas" , "Adolescentes"];

export const MemberForm = ({ member, open, onClose, onSave }: MemberFormProps) => {
  const [formData, setFormData] = useState<Partial<Member>>(
    member || {
      names: "",
      lastNames: "",
      role: "Miembro",
      minister: "Jovenes",
      address: "",
      email: "",
      phone: "",
      image: "",
      baptized: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? "Editar Miembro" : "Agregar Nuevo Miembro"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.names}
              onChange={(e) => setFormData({ ...formData, names: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as MemberRole })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="group">Grupo</Label>
            <Select
              value={formData.minister}
              onValueChange={(value) => setFormData({ ...formData, minister: value as GroupName })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="baptized"
              checked={formData.baptized}
              onCheckedChange={(checked) => setFormData({ ...formData, baptized: checked })}
            />
            <Label htmlFor="baptized">Bautizado</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

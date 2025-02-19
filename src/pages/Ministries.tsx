
import { useState } from "react";
import { Ministry } from "@/types/ministry";
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
import { useMinistries, useCreateMinistry, useUpdateMinistry } from "@/services/ministryApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Group } from "lucide-react";

const MinistryDialog = ({ 
  ministry, 
  open, 
  onOpenChange, 
  onSave 
}: { 
  ministry?: Ministry; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (data: Partial<Ministry>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Ministry>>(ministry || {
    name: "",
    description: "",
    leader: "",
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
            {ministry ? "Editar Ministerio" : "Nuevo Ministerio"}
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
            <Label htmlFor="leader">Líder</Label>
            <Input
              id="leader"
              value={formData.leader}
              onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            {ministry ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Ministries = () => {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: ministries = [], isLoading } = useMinistries();
  const createMinistry = useCreateMinistry();
  const updateMinistry = useUpdateMinistry();

  const handleAddMinistry = async (data: Partial<Ministry>) => {
    try {
      await createMinistry.mutateAsync(data);
      toast({
        title: "Éxito",
        description: "Ministerio creado exitosamente",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el ministerio",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMinistry = async (data: Partial<Ministry>) => {
    if (!selectedMinistry) return;
    try {
      await updateMinistry.mutateAsync({
        id: selectedMinistry.id,
        data,
      });
      toast({
        title: "Éxito",
        description: "Ministerio actualizado exitosamente",
      });
      setIsDialogOpen(false);
      setSelectedMinistry(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el ministerio",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Group className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Ministerios</h1>
        </div>
        <Card>
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-center text-lg font-medium">
              Total de Ministerios: {ministries.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Button onClick={() => {
          setSelectedMinistry(undefined);
          setIsDialogOpen(true);
        }}>
          Agregar Ministerio
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Cargando ministerios...
                </TableCell>
              </TableRow>
            ) : ministries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No hay ministerios registrados
                </TableCell>
              </TableRow>
            ) : (
              ministries.map((ministry) => (
                <TableRow key={ministry.id}>
                  <TableCell className="font-medium">{ministry.name}</TableCell>
                  <TableCell>{ministry.description}</TableCell>
                  <TableCell>{ministry.leader}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMinistry(ministry);
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

      <MinistryDialog
        ministry={selectedMinistry}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={selectedMinistry ? handleUpdateMinistry : handleAddMinistry}
      />
    </div>
  );
};

export default Ministries;

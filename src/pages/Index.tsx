import { useState } from "react";
import { Member, GroupName, MemberRole } from "@/types/member";
import { MemberForm } from "@/components/MemberForm";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, Pencil } from "lucide-react";
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

// Sample data - replace with actual data source later
const initialMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Pastor",
    group: "Adults",
    address: "123 Church St, City",
    email: "john@church.com",
    phone: "(555) 123-4567",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  // Add more sample members as needed
];

const Index = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<GroupName | "all">("all");
  const [filterRole, setFilterRole] = useState<MemberRole | "all">("all");
  const { toast } = useToast();

  const handleAddMember = (newMember: Partial<Member>) => {
    const member = {
      ...newMember,
      id: Date.now().toString(),
    } as Member;
    setMembers([...members, member]);
    toast({
      title: "Success",
      description: "Member added successfully",
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
      title: "Success",
      description: "Member updated successfully",
    });
  };

  const filteredMembers = members.filter((member) => {
    const matchesGroup = filterGroup === "all" || member.group === filterGroup;
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesGroup && matchesRole;
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Church Members</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <Select value={filterGroup} onValueChange={(value: GroupName | "all") => setFilterGroup(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {["Youth", "Worship", "Children", "Adults", "Seniors"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterRole} onValueChange={(value: MemberRole | "all") => setFilterRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {["Pastor", "Elder", "Deacon", "Member", "Visitor"].map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
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
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.group}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{member.email}</span>
                    <span className="text-sm text-muted-foreground">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{member.address}</TableCell>
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
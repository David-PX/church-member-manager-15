import { Member } from "@/types/member";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Mail, Phone } from "lucide-react";

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
}

export const MemberCard = ({ member, onEdit }: MemberCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onEdit(member)}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <img
          src={member.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"}
          alt={member.names}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{member.names}</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{member.role}</Badge>
            <Badge variant="outline">{member.minister}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4" />
          {member.address}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4" />
          {member.email}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {member.phone}
        </div>
      </CardContent>
    </Card>
  );
};
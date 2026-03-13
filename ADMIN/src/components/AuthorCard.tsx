import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, MapPin, BadgeCheck } from "lucide-react";
import { Author } from "@/lib/type";

interface AuthorCardProps {
  author: Author;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
}

const AuthorCard = ({ author, onEdit, onDelete }: AuthorCardProps) => {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3 hover:bg-accent/30 transition-colors">
      {/* Avatar + Info */}
      <div className="flex items-center gap-3">
        <img
          src={author.src}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover border border-border flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold font-heading text-foreground truncate">
            {author.name}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-0.5">
            <BadgeCheck className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{author.title}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mt-0.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{author.location}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-sm flex-1 font-body text-xs h-8"
        >
          <Link to={`/author/${author._id}`}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-sm text-primary hover:text-primary hover:bg-primary/10"
          onClick={() => onEdit(author)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-sm text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(author)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AuthorCard;

import Link from "next/link";
import { MapPin, Heart } from "lucide-react";

interface Props {
  id: string;
  type: "student" | "family" | "project";
  name: string;
  location: string;
  story: string;
  goal: number;
  raised: number;
  image?: string;
  status: "OPEN" | "FULLY_FUNDED" | "COMPLETED";
}

const typeConfig = {
  student: { imgClass: "proj-img-student", emoji: "🎓", badge: "badge-blue", label: "Student" },
  family:  { imgClass: "proj-img-family",  emoji: "🏠", badge: "badge-green", label: "Family" },
  project: { imgClass: "proj-img-water",   emoji: "💧", badge: "badge-gold", label: "Project" },
};

export default function SponsorshipCard({ id, type, name, location, story, goal, raised, image, status }: Props) {
  const pct = Math.min(Math.round((raised / goal) * 100), 100);
  const href = `/${type === "student" ? "students" : type === "family" ? "families" : "projects"}/${id}`;
  const cfg = typeConfig[type];

  return (
    <div className="story-card flex flex-col">
      {/* Image */}
      <div className={`relative h-48 flex items-center justify-center ${image ? "" : cfg.imgClass}`}>
        {image
          ? <img src={image} alt={name} className="w-full h-full object-cover" />
          : <span className="text-6xl drop-shadow">{cfg.emoji}</span>
        }
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge ${cfg.badge} bg-white/90`}>{cfg.label}</span>
          {status === "OPEN"
            ? <span className="badge badge-green bg-white/90">Active</span>
            : status === "FULLY_FUNDED"
            ? <span className="badge badge-gold bg-white/90">Fully Funded</span>
            : <span className="badge badge-blue bg-white/90">Completed</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">{name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3" />{location}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{story}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1.5">
            <span className="font-bold text-gray-900">${raised.toLocaleString()}</span>
            <span className="text-gray-400 text-xs">of ${goal.toLocaleString()} · {pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link
          href={href}
          className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            status === "OPEN"
              ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
              : "bg-gray-100 text-gray-400 cursor-default"
          }`}
        >
          {status === "OPEN"
            ? <><Heart className="w-4 h-4 fill-white" /> Sponsor Now</>
            : status === "FULLY_FUNDED" ? "Fully Funded ✓" : "View Story"}
        </Link>
      </div>
    </div>
  );
}

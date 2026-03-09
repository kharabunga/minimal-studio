import { Play } from "lucide-react";

interface VideoPlaceholderProps {
  filename: string;
  caption: string;
}

const VideoPlaceholder = ({ filename, caption }: VideoPlaceholderProps) => {
  return (
    <div>
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        <span className="text-sm text-muted-foreground font-sans absolute bottom-4">{filename}</span>
        <Play className="w-12 h-12 text-muted-foreground" />
      </div>
      <p className="text-body text-muted-foreground italic mt-3 font-sans">{caption}</p>
    </div>
  );
};

export default VideoPlaceholder;

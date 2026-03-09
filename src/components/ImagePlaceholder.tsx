interface ImagePlaceholderProps {
  filename: string;
  className?: string;
  onClick?: () => void;
}

const ImagePlaceholder = ({ filename, className = "", onClick }: ImagePlaceholderProps) => {
  return (
    <div
      className={`relative aspect-video bg-muted flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <span className="text-sm text-muted-foreground font-sans">{filename}</span>
    </div>
  );
};

export default ImagePlaceholder;

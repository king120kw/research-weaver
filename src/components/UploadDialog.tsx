import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleType: string;
}

export const UploadDialog = ({ open, onOpenChange, moduleType }: UploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number>(10);
  const [format, setFormat] = useState<string>("paragraph");
  const [preserveFormatting, setPreserveFormatting] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Here we would call the upload API
    toast({
      title: "Processing started",
      description: `Your document is being processed with ${pages} pages in ${format} format.`,
    });

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      toast({
        title: "Processing complete",
        description: "Your document has been successfully processed.",
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload your research document for {moduleType}. Max file size: 50MB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.docx,.tex,.md"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Number of Pages</Label>
            <Input
              id="pages"
              type="number"
              min={1}
              max={200}
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph Form</SelectItem>
                <SelectItem value="bullets">Bullet Points</SelectItem>
                <SelectItem value="outline">Outline Structure</SelectItem>
                <SelectItem value="hybrid">Hybrid (Paragraphs + Bullets)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserve"
              checked={preserveFormatting}
              onChange={(e) => setPreserveFormatting(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="preserve" className="cursor-pointer">
              Maintain original document formatting
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isProcessing}>
            {isProcessing ? "Processing..." : "Start Processing"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

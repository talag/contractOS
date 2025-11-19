import { useState } from 'react';
import { XIcon, UploadIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/modalStore';
import { useContractStore } from '@/stores/contractStore';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export function AddContractModal() {
  const { addModalOpen, closeAddModal } = useModalStore();
  const { fetchContracts } = useContractStore();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Upload file to backend for AI extraction
      await api.uploadContract(file);

      // Refresh contracts list from database
      await fetchContracts();

      toast({
        title: 'Contract Uploaded',
        description: `"${file.name}" has been successfully uploaded and processed.`,
      });

      closeAddModal();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload contract',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!addModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/50 z-50 transition-opacity ease-in-out"
        onClick={closeAddModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl transform transition-all ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-card-foreground">Add New Contract</h2>
            <Button
              onClick={closeAddModal}
              variant="ghost"
              size="icon"
              className="text-card-foreground hover:bg-muted"
              aria-label="Close modal"
            >
              <XIcon className="w-6 h-6" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* File Upload */}
            <div>
              <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-12 hover:border-primary transition-colors ease-in-out cursor-pointer">
                <label htmlFor="file-upload" className="cursor-pointer text-center">
                  <UploadIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
                  <p className="text-lg text-card-foreground mb-2">
                    Click to upload contract document
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF or DOCX up to 10MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    AI will automatically extract contract details
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </label>
              </div>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mt-4">
                <Loader2Icon className="w-5 h-5 animate-spin text-primary" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Uploading and extracting contract details with AI...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex justify-end">
            <Button
              onClick={closeAddModal}
              variant="outline"
              className="bg-card text-card-foreground border-border font-normal"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

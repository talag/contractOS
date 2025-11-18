import { useState } from 'react';
import { XIcon, UploadIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/stores/modalStore';
import { useContractStore } from '@/stores/contractStore';
import { useToast } from '@/hooks/use-toast';

export function AddContractModal() {
  const { addModalOpen, closeAddModal } = useModalStore();
  const addContract = useContractStore((state) => state.addContract);
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pointOfContact: '',
    startDate: '',
    endDate: '',
    value: '',
    status: 'Active' as const,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // Simulate LLM extraction
    setTimeout(() => {
      setFormData({
        name: 'Extracted Contract Name',
        pointOfContact: 'John Doe',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        value: '50000',
        status: 'Active',
      });
      setIsProcessing(false);
      toast({
        title: 'Contract Extracted',
        description: 'AI has extracted contract details. Please review and edit if needed.',
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addContract({
      id: `contract-${Date.now()}`,
      name: formData.name,
      pointOfContact: formData.pointOfContact,
      startDate: formData.startDate,
      endDate: formData.endDate,
      value: parseFloat(formData.value),
      status: formData.status,
    });

    toast({
      title: 'Contract Added',
      description: `${formData.name} has been successfully added.`,
    });

    closeAddModal();
    setFormData({
      name: '',
      pointOfContact: '',
      startDate: '',
      endDate: '',
      value: '',
      status: 'Active',
    });
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
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all ease-in-out">
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File UploadIcon */}
              <div>
                <Label htmlFor="file-upload" className="text-card-foreground">
                  UploadIcon Contract Document
                </Label>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors ease-in-out cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer text-center">
                    <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
                    <p className="text-sm text-card-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF or DOCX up to 10MB</p>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Loader2Icon className="w-5 h-5 animate-spin text-primary" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">AI is extracting contract details...</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-card-foreground">
                    Contract Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 bg-background text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="contact" className="text-card-foreground">
                    Point of Contact
                  </Label>
                  <Input
                    id="contact"
                    value={formData.pointOfContact}
                    onChange={(e) => setFormData({ ...formData, pointOfContact: e.target.value })}
                    required
                    className="mt-1 bg-background text-foreground border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-card-foreground">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="mt-1 bg-background text-foreground border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-card-foreground">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="mt-1 bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="value" className="text-card-foreground">
                    Contract Value ($)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    className="mt-1 bg-background text-foreground border-border"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex gap-3">
            <Button
              onClick={closeAddModal}
              variant="outline"
              className="flex-1 bg-card text-card-foreground border-border font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary text-primary-foreground font-normal"
              disabled={isProcessing}
            >
              Save Contract
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

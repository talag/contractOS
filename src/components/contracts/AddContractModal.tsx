import { useState } from 'react';
import { XIcon, UploadIcon, Loader2Icon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModalStore } from '@/stores/modalStore';
import { useContractStore } from '@/stores/contractStore';
import { useToast } from '@/hooks/use-toast';
import { contractsService, ExtractedContract } from '@/lib/contracts';

type Step = 'upload' | 'review';

export function AddContractModal() {
  const { addModalOpen, closeAddModal } = useModalStore();
  const { fetchContracts } = useContractStore();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedContract | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Extract contract details using AI (without saving to DB)
      const data = await contractsService.extractContract(file);

      setExtractedData(data);
      setStep('review');

      toast({
        title: 'Extraction Complete',
        description: 'Review and edit the extracted fields before saving.',
      });
    } catch (error) {
      toast({
        title: 'Extraction Failed',
        description: error instanceof Error ? error.message : 'Failed to extract contract details',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;

    setIsSaving(true);

    try {
      // Save the reviewed/edited contract to database
      await contractsService.saveContract(extractedData);

      // Refresh contracts list from database
      await fetchContracts();

      toast({
        title: 'Contract Saved',
        description: `"${extractedData.file_name}" has been successfully saved.`,
      });

      // Reset and close
      setStep('upload');
      setExtractedData(null);
      closeAddModal();
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save contract',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setStep('upload');
    setExtractedData(null);
    closeAddModal();
  };

  const handleBack = () => {
    setStep('upload');
    setExtractedData(null);
  };

  const updateField = (field: keyof ExtractedContract, value: string | number | null) => {
    if (!extractedData) return;
    setExtractedData({ ...extractedData, [field]: value });
  };

  if (!addModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/50 z-50 transition-opacity ease-in-out"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-3xl transform transition-all ease-in-out max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-semibold text-card-foreground">
                {step === 'upload' ? 'Add New Contract' : 'Review Extracted Details'}
              </h2>
              {step === 'review' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Review and edit the AI-extracted fields before saving
                </p>
              )}
            </div>
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="icon"
              className="text-card-foreground hover:bg-muted"
              aria-label="Close modal"
            >
              <XIcon className="w-6 h-6" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'upload' ? (
              <>
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
                    <p className="text-sm text-muted-foreground">Extracting contract details with AI...</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Review Form */}
                {extractedData && (
                  <div className="space-y-6">
                    {/* File Name */}
                    <div>
                      <Label htmlFor="file_name" className="text-sm font-medium text-muted-foreground">
                        File Name
                      </Label>
                      <Input
                        id="file_name"
                        value={extractedData.file_name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('file_name', e.target.value)}
                        className="mt-2 bg-card text-card-foreground border-border"
                        disabled
                      />
                    </div>

                    {/* Contact Name */}
                    <div>
                      <Label htmlFor="contact_name" className="text-sm font-medium text-muted-foreground">
                        Contact Name
                      </Label>
                      <Input
                        id="contact_name"
                        value={extractedData.contact_name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('contact_name', e.target.value)}
                        placeholder="Enter contact name"
                        className="mt-2 bg-card text-card-foreground border-border"
                      />
                    </div>

                    {/* Contact Email */}
                    <div>
                      <Label htmlFor="contact_email" className="text-sm font-medium text-muted-foreground">
                        Contact Email
                      </Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={extractedData.contact_email || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('contact_email', e.target.value)}
                        placeholder="Enter contact email"
                        className="mt-2 bg-card text-card-foreground border-border"
                      />
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <Label htmlFor="contact_phone" className="text-sm font-medium text-muted-foreground">
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        value={extractedData.contact_phone || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('contact_phone', e.target.value)}
                        placeholder="Enter contact phone"
                        className="mt-2 bg-card text-card-foreground border-border"
                      />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date" className="text-sm font-medium text-muted-foreground">
                          Start Date
                        </Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={extractedData.start_date || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('start_date', e.target.value)}
                          className="mt-2 bg-card text-card-foreground border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date" className="text-sm font-medium text-muted-foreground">
                          End Date
                        </Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={extractedData.end_date || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('end_date', e.target.value)}
                          className="mt-2 bg-card text-card-foreground border-border"
                        />
                      </div>
                    </div>

                    {/* Contract Value */}
                    <div>
                      <Label htmlFor="contract_value" className="text-sm font-medium text-muted-foreground">
                        Contract Value ($)
                      </Label>
                      <Input
                        id="contract_value"
                        type="number"
                        value={extractedData.contract_value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('contract_value', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Enter contract value"
                        className="mt-2 bg-card text-card-foreground border-border"
                      />
                    </div>

                    {/* Payment Terms */}
                    <div>
                      <Label htmlFor="payment_terms" className="text-sm font-medium text-muted-foreground">
                        Payment Terms
                      </Label>
                      <Textarea
                        id="payment_terms"
                        value={extractedData.payment_terms || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('payment_terms', e.target.value)}
                        placeholder="Enter payment terms"
                        rows={3}
                        className="mt-2 bg-card text-card-foreground border-border resize-none"
                      />
                    </div>

                    {/* Termination Terms */}
                    <div>
                      <Label htmlFor="termination_terms" className="text-sm font-medium text-muted-foreground">
                        Termination Terms
                      </Label>
                      <Textarea
                        id="termination_terms"
                        value={extractedData.termination_terms || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('termination_terms', e.target.value)}
                        placeholder="Enter termination terms"
                        rows={3}
                        className="mt-2 bg-card text-card-foreground border-border resize-none"
                      />
                    </div>

                    {/* Summary */}
                    <div>
                      <Label htmlFor="summary" className="text-sm font-medium text-muted-foreground">
                        Summary
                      </Label>
                      <Textarea
                        id="summary"
                        value={extractedData.summary || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('summary', e.target.value)}
                        placeholder="Enter summary"
                        rows={4}
                        className="mt-2 bg-card text-card-foreground border-border resize-none"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex justify-between">
            {step === 'upload' ? (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-card text-card-foreground border-border font-normal"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="bg-card text-card-foreground border-border font-normal"
                  disabled={isSaving}
                >
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="bg-card text-card-foreground border-border font-normal"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground font-normal"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2Icon className="w-4 h-4 mr-2 animate-spin" strokeWidth={1.5} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Save Contract
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

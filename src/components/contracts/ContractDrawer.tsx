import { XIcon, Trash2Icon, EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useModalStore } from '@/stores/modalStore';
import { useContractStore } from '@/stores/contractStore';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useState } from 'react';

export function ContractDrawer() {
  const { detailDrawerOpen, selectedContractId, closeDetailDrawer } = useModalStore();
  const { contracts, deleteContract } = useContractStore();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const contract = contracts.find((c) => c.id === selectedContractId);

  if (!detailDrawerOpen || !contract) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Call backend API to delete from database
      await api.deleteContract(Number(contract.id));

      // Delete from local store
      deleteContract(contract.id);

      setShowDeleteDialog(false);
      closeDetailDrawer();

      toast({
        title: 'Contract Deleted',
        description: `"${contract.name}" has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete contract',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/50 z-50 transition-opacity ease-in-out"
        onClick={closeDetailDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-card border-l border-border z-50 shadow-xl transform transition-transform ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-semibold text-card-foreground">{contract.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Value: ${contract.value.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={closeDetailDrawer}
              variant="ghost"
              size="icon"
              className="text-card-foreground hover:bg-muted"
              aria-label="Close drawer"
            >
              <XIcon className="w-6 h-6" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:text-foreground">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-muted-foreground data-[state=active]:text-foreground">
                  Terms
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Point of Contact</h3>
                  <p className="text-card-foreground">{contract.pointOfContact}</p>
                </div>

                <Separator className="bg-border" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Start Date</h3>
                    <p className="text-card-foreground">{contract.startDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">End Date</h3>
                    <p className="text-card-foreground">{contract.endDate}</p>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                  <span
                    className={`inline-flex px-3 py-1 rounded text-sm font-medium ${
                      contract.status === 'Active'
                        ? 'bg-success/10 text-success'
                        : contract.status === 'Expired'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Summary</h3>
                  <p className="text-card-foreground leading-relaxed">
                    {contract.summary || 'No summary available'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Terms</h3>
                  <p className="text-card-foreground">
                    {contract.paymentTerms || 'No payment terms available'}
                  </p>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Termination Clause</h3>
                  <p className="text-card-foreground leading-relaxed">
                    {contract.terminationTerms || 'No termination terms available'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-card text-card-foreground border-border font-normal"
            >
              <EditIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Edit Contract
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="flex-1 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-normal"
            >
              <Trash2Icon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the contract "{contract.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-card text-card-foreground border-border font-normal">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground font-normal"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

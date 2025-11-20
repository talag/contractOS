import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/modalStore';
import { useContractStore } from '@/stores/contractStore';
import { useToast } from '@/hooks/use-toast';
import { contractsService } from '@/lib/contracts';
import { Contract } from '@/types/contract';

interface ContractTableProps {
  contracts: Contract[];
}

type SortField = 'name' | 'startDate' | 'endDate' | 'value';
type SortDirection = 'asc' | 'desc';

export function ContractTable({ contracts }: ContractTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const openDetailDrawer = useModalStore((state) => state.openDetailDrawer);
  const { deleteContract } = useContractStore();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent, contractId: string, contractName: string) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${contractName}"?`)) {
      return;
    }

    setDeletingId(contractId);
    try {
      await contractsService.deleteContract(Number(contractId));
      deleteContract(contractId);
      toast({
        title: 'Contract Deleted',
        description: `"${contractName}" has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete contract',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'startDate' || sortField === 'endDate') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 inline ml-1" strokeWidth={1.5} />
    ) : (
      <ChevronDownIcon className="w-4 h-4 inline ml-1" strokeWidth={1.5} />
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead
                className="cursor-pointer text-muted-foreground font-medium"
                onClick={() => handleSort('name')}
              >
                Contract Name <SortIcon field="name" />
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">Point of Contact</TableHead>
              <TableHead
                className="cursor-pointer text-muted-foreground font-medium"
                onClick={() => handleSort('startDate')}
              >
                Start Date <SortIcon field="startDate" />
              </TableHead>
              <TableHead
                className="cursor-pointer text-muted-foreground font-medium"
                onClick={() => handleSort('endDate')}
              >
                End Date <SortIcon field="endDate" />
              </TableHead>
              <TableHead
                className="cursor-pointer text-muted-foreground font-medium"
                onClick={() => handleSort('value')}
              >
                Value <SortIcon field="value" />
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContracts.map((contract) => (
              <TableRow
                key={contract.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors ease-in-out"
                onClick={() => openDetailDrawer(contract.id)}
              >
                <TableCell className="font-medium text-card-foreground">{contract.name}</TableCell>
                <TableCell className="text-card-foreground">{contract.pointOfContact}</TableCell>
                <TableCell className="text-card-foreground">{contract.startDate}</TableCell>
                <TableCell className="text-card-foreground">{contract.endDate}</TableCell>
                <TableCell className="text-card-foreground">${contract.value.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      contract.status === 'Active'
                        ? 'bg-success/10 text-success'
                        : contract.status === 'Expired'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {contract.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, contract.id, contract.name)}
                    disabled={deletingId === contract.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4 p-4">
        {sortedContracts.map((contract) => (
          <div
            key={contract.id}
            className="p-4 rounded-lg border border-border bg-card"
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className="font-medium text-card-foreground cursor-pointer flex-1"
                onClick={() => openDetailDrawer(contract.id)}
              >
                {contract.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    contract.status === 'Active'
                      ? 'bg-success/10 text-success'
                      : contract.status === 'Expired'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {contract.status}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(e, contract.id, contract.name)}
                  disabled={deletingId === contract.id}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2Icon className="w-4 h-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="text-card-foreground">{contract.pointOfContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start:</span>
                <span className="text-card-foreground">{contract.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End:</span>
                <span className="text-card-foreground">{contract.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="text-card-foreground font-medium">${contract.value.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { PlusIcon, SearchIcon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractTable } from '@/components/contracts/ContractTable';
import { ContractDrawer } from '@/components/contracts/ContractDrawer';
import { AddContractModal } from '@/components/contracts/AddContractModal';
import { useContractStore } from '@/stores/contractStore';
import { useModalStore } from '@/stores/modalStore';

export function ContractsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const contracts = useContractStore((state) => state.contracts);
  const openAddModal = useModalStore((state) => state.openAddModal);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.pointOfContact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const headers = ['Contract Name', 'Point of Contact', 'Start Date', 'End Date', 'Value', 'Status'];
    const rows = filteredContracts.map((c) => [
      c.name,
      c.pointOfContact,
      c.startDate,
      c.endDate,
      c.value.toString(),
      c.status,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contracts.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Contracts</h1>
          <p className="text-muted-foreground mt-2">Manage and organize all your contracts.</p>
        </div>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground font-normal">
          <PlusIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Add Contract
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="SearchIcon contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card text-card-foreground border-border"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full lg:w-48 bg-card text-card-foreground border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contracts</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExportCSV} variant="outline" className="bg-card text-card-foreground border-border font-normal">
          <DownloadIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <ContractTable contracts={filteredContracts} />

      {/* Modals */}
      <ContractDrawer />
      <AddContractModal />
    </div>
  );
}

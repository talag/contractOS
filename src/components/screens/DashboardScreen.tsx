import { PlusIcon, TrendingUpIcon, ClockIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractStore } from '@/stores/contractStore';
import { useModalStore } from '@/stores/modalStore';

export function DashboardScreen() {
  const contracts = useContractStore((state) => state.contracts);
  const openAddModal = useModalStore((state) => state.openAddModal);

  const activeContracts = contracts.filter((c) => c.status === 'Active').length;
  const expiringContracts = contracts.filter((c) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);

  const recentContracts = contracts.slice(0, 3);

  return (
    <div className="p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your contract overview.</p>
        </div>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground font-normal">
          <PlusIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Add Contract
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Contracts</CardTitle>
            <FileText className="w-5 h-5 text-tertiary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-card-foreground">{activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-2">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Expiring Soon</CardTitle>
            <ClockIcon className="w-5 h-5 text-warning" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-card-foreground">{expiringContracts}</div>
            <p className="text-xs text-muted-foreground mt-2">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Contract Value</CardTitle>
            <DollarSignIcon className="w-5 h-5 text-success" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-card-foreground">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Combined value</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Contracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentContracts.map((contract) => (
            <Card key={contract.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium text-card-foreground">{contract.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="text-card-foreground">{contract.pointOfContact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-card-foreground">${contract.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={
                      contract.status === 'Active'
                        ? 'text-success'
                        : contract.status === 'Expired'
                        ? 'text-destructive'
                        : 'text-warning'
                    }
                  >
                    {contract.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

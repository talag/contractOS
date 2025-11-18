import { useState } from 'react';
import { SaveIcon, KeyIcon, BellIcon, UserIcon, DatabaseIcon, ShieldIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SettingsScreen() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profile
    companyName: 'Acme Corporation',
    email: 'admin@acme.com',
    phone: '+1 (555) 123-4567',
    
    // API Keys
    openaiKey: '••••••••••••••••',
    
    // Notifications
    emailNotifications: true,
    contractExpiry: true,
    expiryDays: '30',
    newContracts: true,
    weeklyReports: false,
    
    // Data & Storage
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '365',
    
    // Security
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  const handleTestConnection = () => {
    toast({
      title: 'Testing Connection',
      description: 'Verifying API key...',
    });
    
    setTimeout(() => {
      toast({
        title: 'Connection Successful',
        description: 'OpenAI API key is valid and working.',
      });
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your application preferences and configurations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted">
          <TabsTrigger value="profile" className="text-muted-foreground data-[state=active]:text-foreground">
            <UserIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="text-muted-foreground data-[state=active]:text-foreground">
            <KeyIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-muted-foreground data-[state=active]:text-foreground">
            <BellIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="text-muted-foreground data-[state=active]:text-foreground">
            <DatabaseIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Data
          </TabsTrigger>
          <TabsTrigger value="security" className="text-muted-foreground data-[state=active]:text-foreground">
            <ShieldIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-card-foreground">Company Information</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your company details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-card-foreground">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="mt-1 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-1 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-card-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="mt-1 bg-background text-foreground border-border"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground font-normal">
              <SaveIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-card-foreground">OpenAI API Key</CardTitle>
              <CardDescription className="text-muted-foreground">
                Required for AI-powered contract extraction and analytics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openaiKey" className="text-card-foreground">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="openaiKey"
                    type="password"
                    value={settings.openaiKey}
                    onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                    placeholder="sk-..."
                    className="bg-background text-foreground border-border"
                  />
                  <Button
                    onClick={handleTestConnection}
                    variant="outline"
                    className="bg-card text-card-foreground border-border font-normal"
                  >
                    Test
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get your API key from{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    OpenAI Platform
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground font-normal">
              <SaveIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-card-foreground">Email Notifications</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure when you want to receive email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">Contract Expiry Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when contracts are about to expire</p>
                </div>
                <Switch
                  checked={settings.contractExpiry}
                  onCheckedChange={(checked) => setSettings({ ...settings, contractExpiry: checked })}
                />
              </div>

              {settings.contractExpiry && (
                <div className="ml-6">
                  <Label htmlFor="expiryDays" className="text-card-foreground">Alert Days Before Expiry</Label>
                  <Select
                    value={settings.expiryDays}
                    onValueChange={(value) => setSettings({ ...settings, expiryDays: value })}
                  >
                    <SelectTrigger className="w-full mt-1 bg-background text-foreground border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">New Contract Uploads</Label>
                  <p className="text-sm text-muted-foreground">Notify when new contracts are added</p>
                </div>
                <Switch
                  checked={settings.newContracts}
                  onCheckedChange={(checked) => setSettings({ ...settings, newContracts: checked })}
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly contract summary reports</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground font-normal">
              <SaveIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Data & Storage */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-card-foreground">Backup & Storage</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your data backup and retention policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your contract database</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>

              {settings.autoBackup && (
                <>
                  <div>
                    <Label htmlFor="backupFrequency" className="text-card-foreground">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                    >
                      <SelectTrigger className="w-full mt-1 bg-background text-foreground border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="retentionPeriod" className="text-card-foreground">Retention Period (days)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={settings.retentionPeriod}
                      onChange={(e) => setSettings({ ...settings, retentionPeriod: e.target.value })}
                      className="mt-1 bg-background text-foreground border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      How long to keep backup files before automatic deletion
                    </p>
                  </div>
                </>
              )}

              <Separator className="bg-border" />

              <div className="space-y-3">
                <Label className="text-card-foreground">Data Management</Label>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground border-border font-normal"
                    onClick={() => {
                      toast({
                        title: 'Backup Created',
                        description: 'Database backup created successfully.',
                      });
                    }}
                  >
                    Create Backup Now
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground border-border font-normal"
                    onClick={() => {
                      toast({
                        title: 'Export Started',
                        description: 'Exporting all data...',
                      });
                    }}
                  >
                    Export All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground font-normal">
              <SaveIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-card-foreground">Security Settings</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure security and authentication options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-card-foreground">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactor: checked })}
                />
              </div>

              <Separator className="bg-border" />

              <div>
                <Label htmlFor="sessionTimeout" className="text-card-foreground">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="mt-1 bg-background text-foreground border-border"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Automatically log out after period of inactivity
                </p>
              </div>

              <div>
                <Label htmlFor="passwordExpiry" className="text-card-foreground">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => setSettings({ ...settings, passwordExpiry: e.target.value })}
                  className="mt-1 bg-background text-foreground border-border"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Require password change after specified days
                </p>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <Label className="text-card-foreground">Password Management</Label>
                <Button
                  variant="outline"
                  className="bg-card text-card-foreground border-border font-normal"
                  onClick={() => {
                    toast({
                      title: 'Password Reset',
                      description: 'Password reset link sent to your email.',
                    });
                  }}
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground font-normal">
              <SaveIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

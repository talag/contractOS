import { useState } from 'react';
import { PlusIcon, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { useAnalyticsStore } from '@/stores/analyticsStore';

export function AnalyticsScreen() {
  const [chatInput, setChatInput] = useState('');
  const { messages, charts, addMessage, addChart } = useAnalyticsStore();

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    addMessage({ role: 'user', content: chatInput });

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: 'I can help you visualize that data. Let me create a chart for you.',
      });

      // Simulate adding a chart based on query
      if (chatInput.toLowerCase().includes('value')) {
        addChart({
          id: `chart-${Date.now()}`,
          title: 'Contract Value Over Time',
          type: 'line',
        });
      } else if (chatInput.toLowerCase().includes('expir')) {
        addChart({
          id: `chart-${Date.now()}`,
          title: 'Expiration Timeline',
          type: 'bar',
        });
      }
    }, 1000);

    setChatInput('');
  };

  return (
    <div className="p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">AI-powered insights and visualizations.</p>
      </div>

      {/* AI Chat Widget - Horizontal */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-card-foreground">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-64 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                      : 'bg-muted text-muted-foreground mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your contracts..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-background text-foreground border-border"
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-primary text-primary-foreground">
              <SendIcon className="w-5 h-5" strokeWidth={1.5} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Visualizations</h2>
          <Button
            onClick={() =>
              addChart({
                id: `chart-${Date.now()}`,
                title: 'New Chart',
                type: 'line',
              })
            }
            variant="outline"
            className="bg-card text-card-foreground border-border font-normal"
          >
            <PlusIcon className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Add Graph
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {charts.map((chart) => (
            <AnalyticsChart key={chart.id} chart={chart} />
          ))}
        </div>
      </div>
    </div>
  );
}

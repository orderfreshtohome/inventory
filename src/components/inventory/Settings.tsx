import { useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function Settings() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const products = localStorage.getItem('inventory_products') || '[]';
    const categories = localStorage.getItem('inventory_categories') || '[]';
    
    const data = {
      products: JSON.parse(products),
      categories: JSON.parse(categories),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Your inventory data has been exported.',
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.products) {
          localStorage.setItem('inventory_products', JSON.stringify(data.products));
        }
        if (data.categories) {
          localStorage.setItem('inventory_categories', JSON.stringify(data.categories));
        }

        toast({
          title: 'Import successful',
          description: 'Your inventory data has been imported. Please refresh the page.',
        });

        setTimeout(() => window.location.reload(), 1500);
      } catch {
        toast({
          title: 'Import failed',
          description: 'Invalid file format. Please use a valid backup file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    localStorage.removeItem('inventory_products');
    localStorage.removeItem('inventory_categories');
    setShowClearDialog(false);
    
    toast({
      title: 'Data cleared',
      description: 'All inventory data has been removed.',
    });

    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your inventory data</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">Download a backup of your inventory</p>
              </div>
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground">Import Data</p>
                <p className="text-sm text-muted-foreground">Restore from a backup file</p>
              </div>
              <label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Import
                  </span>
                </Button>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div>
                <p className="font-medium text-foreground">Clear All Data</p>
                <p className="text-sm text-muted-foreground">Permanently delete all inventory data</p>
              </div>
              <Button 
                onClick={() => setShowClearDialog(true)} 
                variant="destructive" 
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>InventoryPro</strong> - Simple Inventory Management</p>
            <p>Data is stored locally in your browser using localStorage.</p>
            <p>No account required. Your data never leaves your device.</p>
          </div>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all products and categories. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

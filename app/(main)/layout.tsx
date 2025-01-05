import { FunctionComponent } from 'react';
import Header from './_components/header';
import SidebarDesktop from './_components/sidebar-desktop';
import { Plus } from 'lucide-react';
import { DialogCreateNewFeed } from './_components/dialogs/dialog-create-new-feed';
import { Card } from '@/components/ui/card';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex w-full h-full bg-neutral-900 justify-between">
      <SidebarDesktop />
      <main className="relative w-full h-full flex flex-col items-center  text-white">
        <Header />
        <Card className="lg:w-[40%] w-full mt-16">{children}</Card>
      </main>
      <DialogCreateNewFeed>
        <div className="fixed z-10 cursor-pointer bottom-8 hover:bg-gray-300 transition-all duration-300 right-8 bg-white dark:text-neutral-900 flex items-center justify-center rounded-lg">
          <div className="size-16 flex items-center justify-center">
            <Plus className="w-8 h-8" />
          </div>
        </div>
      </DialogCreateNewFeed>
    </div>
  );
};

export default MainLayout;

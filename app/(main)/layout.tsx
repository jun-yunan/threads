import { FunctionComponent } from 'react';
import Header from './_components/header';
import SidebarDesktop from './_components/sidebar-desktop';
import { Plus } from 'lucide-react';
import { DialogCreateNewFeed } from './_components/dialogs/dialog-create-new-feed';
import { Card } from '@/components/ui/card';
import NavMobile from './_components/nav-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex w-full h-full justify-between">
      <SidebarDesktop />
      <main className="relative w-full h-full flex flex-col items-center">
        <Header />
        <Card className="lg:w-[40%] w-full mt-16">{children}</Card>
      </main>
      <DialogCreateNewFeed>
        <div className="fixed z-10 hidden cursor-pointer bottom-8 hover:bg-gray-300 transition-all duration-300 right-8 bg-white border-2 dark:text-neutral-900 lg:flex items-center justify-center rounded-lg">
          <div className="size-16 flex items-center justify-center">
            <Plus className="w-8 h-8" />
          </div>
        </div>
      </DialogCreateNewFeed>
      <NavMobile />
    </div>
  );
};

export default MainLayout;

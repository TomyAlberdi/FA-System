import { Activity } from "lucide-react";

const Home = () => {
  return (
    <div className="Home h-full w-full flex flex-row items-center justify-center">
      <div className="flex aspect-square size-28 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Activity className="size-20" />
      </div>
      <div className="text-3xl leading-tight ml-4 flex flex-col items-left justify-center">
        <span className="truncate font-semibold">SB - Cerámicos Olavarría</span>
        <span>Administración</span>
      </div>
    </div>
  );
};
export default Home;

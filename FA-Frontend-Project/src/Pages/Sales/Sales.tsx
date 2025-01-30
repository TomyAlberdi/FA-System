import { Activity } from "lucide-react";

export const Sales = () => {
  return (
    <div className="Sales h-full w-full flex flex-row items-center justify-center">
      <div className="flex aspect-square size-28 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Activity className="size-20" />
      </div>
      <div className="text-4xl leading-tight ml-4 flex flex-col items-left justify-center">
        <span>En desarrollo</span>
      </div>
    </div>
  );
};

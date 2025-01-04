"use client";
import { Input } from "./ui/input";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
const StrategyHeader = ({
  strategy,
  isEditing,
  handleInputChange,
  handleStatusToggle,
}) => (
  <DialogHeader>
    <DialogTitle className="flex justify-between items-center">
      {isEditing ? (
        <Input
          name="strategyName"
          value={strategy.strategyName}
          onChange={handleInputChange}
          className="text-2xl font-bold"
        />
      ) : (
        <span className="text-2xl font-bold">{strategy.strategyName}</span>
      )}
      <div className="flex items-center gap-2">
        <Switch
          checked={strategy.status}
          onCheckedChange={handleStatusToggle}
          disabled={!isEditing}
        />
        <Badge
          variant={strategy.status ? "success" : "secondary"}
          className={`${
            strategy.status ? "bg-green-500" : "bg-gray-500"
          } text-white`}
        >
          {strategy.status ? "Active" : "Inactive"}
        </Badge>
      </div>
    </DialogTitle>
  </DialogHeader>
);

export default StrategyHeader;

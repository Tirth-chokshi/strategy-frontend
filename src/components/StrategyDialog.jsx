import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const StrategyDialog = ({ strategyId, onUpdate, onDelete }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDetailDialogOpen, setDeleteDetailDialogOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [isAddStrikeOpen, setIsAddStrikeOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStrategyDetails();
    }
  }, [isOpen]);
  const handleAddStrike = async (newStrike) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/${strategyId}/details`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ strategyDetails: [newStrike] }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add strategy detail");
      }

      const result = await response.json();
      setStrategy(result.data);
      setIsAddStrikeOpen(false);

      toast({
        title: "Success",
        description: "Strike added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchStrategyDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/get/${strategyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch strategy details");
      }

      const result = await response.json();
      setStrategy(result.data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, detailIndex = -1) => {
    const { name, value } = e.target;
    if (detailIndex === -1) {
      setStrategy((prev) => ({ ...prev, [name]: value }));
    } else {
      setStrategy((prev) => ({
        ...prev,
        strategyDetails: prev.strategyDetails.map((detail, index) =>
          index === detailIndex ? { ...detail, [name]: value } : detail
        ),
      }));
    }
  };

  const handleTypeChange = (value, detailIndex) => {
    setStrategy((prev) => ({
      ...prev,
      strategyDetails: prev.strategyDetails.map((detail, index) =>
        index === detailIndex ? { ...detail, type: value } : detail
      ),
    }));
  };

  const handleDeleteDetail = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/${strategyId}/details/${selectedDetailId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy detail");
      }

      setStrategy((prev) => ({
        ...prev,
        strategyDetails: prev.strategyDetails.filter(
          (detail) => detail._id !== selectedDetailId
        ),
      }));

      toast({
        title: "Success",
        description: "Strategy detail deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDetailDialogOpen(false);
      setSelectedDetailId(null);
    }
  };

  const handleStatusToggle = () => {
    setStrategy((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/update/${strategyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(strategy),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update strategy");
      }

      onUpdate(strategy);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Strategy updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/delete/${strategyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete strategy");
      }

      onDelete(strategyId);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Strategy deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="hover:bg-slate-100">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <span className="text-lg">Loading...</span>
            </div>
          ) : strategy ? (
            <>
              <StrategyHeader
                strategy={strategy}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
                handleStatusToggle={handleStatusToggle}
              />

              <StrategyTimestamps
                createdAt={strategy.createdAt}
                updatedAt={strategy.updatedAt}
              />

              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setIsAddStrikeOpen(true)}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" /> Add New Strike
                </Button>
              </div>
              <StrategyDetailsTable
                details={strategy.strategyDetails}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
                handleTypeChange={handleTypeChange}
                handleDeleteDetail={(detailId) => {
                  setSelectedDetailId(detailId);
                  setDeleteDetailDialogOpen(true);
                }}
              />

              <DialogFooter>
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialogOpen(true)}
                      variant="destructive"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <AddStrikeDialog
        isOpen={isAddStrikeOpen}
        onClose={() => setIsAddStrikeOpen(false)}
        onSubmit={handleAddStrike}
        isLoading={isLoading}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="Delete Strategy"
        description="Are you sure you want to delete this strategy? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        isOpen={deleteDetailDialogOpen}
        onClose={setDeleteDetailDialogOpen}
        onConfirm={handleDeleteDetail}
        isLoading={isLoading}
        title="Delete Strategy Detail"
        description="Are you sure you want to delete this strategy detail? This action cannot be undone."
      />
    </>
  );
};

export default StrategyDialog;

// Strategy Header Component
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

// Strategy Timestamps Component
const StrategyTimestamps = ({ createdAt, updatedAt }) => (
  <div className="space-y-4">
    <div className="text-sm">
      <span className="font-bold">Created At</span>:{" "}
      {new Date(createdAt).toLocaleString()}
    </div>
    <div className="text-sm">
      <span className="font-bold">Last Updated</span>:{" "}
      {new Date(updatedAt).toLocaleString()}
    </div>
  </div>
);

// Strategy Details Table Component
const StrategyDetailsTable = ({
  details,
  isEditing,
  handleInputChange,
  handleTypeChange,
  handleDeleteDetail,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Strike Price</TableHead>
        <TableHead>Trading Symbol</TableHead>
        <TableHead>Instrument Token</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Updated At</TableHead>
        {isEditing && <TableHead>Actions</TableHead>}
      </TableRow>
    </TableHeader>
    <TableBody>
      {details.map((detail, index) => (
        <TableRow key={detail._id}>
          <TableCell>
            {isEditing ? (
              <Input
                name="strikePrice"
                value={detail.strikePrice}
                onChange={(e) => handleInputChange(e, index)}
                type="number"
              />
            ) : (
              detail.strikePrice
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <Input
                name="tradingSymbol"
                value={detail.tradingSymbol}
                onChange={(e) => handleInputChange(e, index)}
              />
            ) : (
              detail.tradingSymbol
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <Input
                name="instrumentToken"
                value={detail.instrumentToken}
                onChange={(e) => handleInputChange(e, index)}
              />
            ) : (
              detail.instrumentToken
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <Select
                value={detail.type}
                onValueChange={(value) => handleTypeChange(value, index)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue>{detail.type}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="PE">PE</SelectItem>
                  <SelectItem value="FUTURES">FUTURES</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                className={`
                ${
                  detail.type === "CE"
                    ? "bg-blue-500"
                    : detail.type === "PE"
                    ? "bg-purple-500"
                    : "bg-orange-500"
                } text-white`}
              >
                {detail.type}
              </Badge>
            )}
          </TableCell>
          <TableCell>{new Date(detail.createdAt).toLocaleString()}</TableCell>
          <TableCell>{new Date(detail.updatedAt).toLocaleString()}</TableCell>
          {isEditing && (
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteDetail(detail._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const AddStrikeDialog = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [newStrike, setNewStrike] = useState({
    strikePrice: "",
    tradingSymbol: "",
    instrumentToken: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newStrike);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Strike</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strikePrice">Strike Price</Label>
            <Input
              id="strikePrice"
              type="number"
              value={newStrike.strikePrice}
              onChange={(e) =>
                setNewStrike({ ...newStrike, strikePrice: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradingSymbol">Trading Symbol</Label>
            <Input
              id="tradingSymbol"
              value={newStrike.tradingSymbol}
              onChange={(e) =>
                setNewStrike({ ...newStrike, tradingSymbol: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrumentToken">Instrument Token</Label>
            <Input
              id="instrumentToken"
              value={newStrike.instrumentToken}
              onChange={(e) =>
                setNewStrike({ ...newStrike, instrumentToken: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={newStrike.type}
              onValueChange={(value) =>
                setNewStrike({ ...newStrike, type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CE">CE</SelectItem>
                <SelectItem value="PE">PE</SelectItem>
                <SelectItem value="FUTURES">FUTURES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Strike"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

"use client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
// import AddStrikeDialog from "./AddStrikeDialog";
import StrategyDetailsTable from "./StrategyDetailsTable";
import StrategyHeader from "./StrategyHeader";
import StrategyTimestamps from "./StrategyTimestamps";
import AddStrikeDialog from "./AddStrikeDialog";

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
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

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
        `${apiurl}/strategies/${strategyId}/details`,
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
        `${apiurl}/strategies/get/${strategyId}`,
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
        `${apiurl}/strategies/${strategyId}/details/${selectedDetailId}`,
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
        `${apiurl}/strategies/update/${strategyId}`,
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
        `${apiurl}/strategies/delete/${strategyId}`,
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
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-2">
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
                </div>

                <Button
                  onClick={() => setIsAddStrikeOpen(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> New Strike
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

              <DialogFooter></DialogFooter>
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
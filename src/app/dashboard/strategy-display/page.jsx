"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import StrategyDialog from "@/components/StrategyDialog";
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

const StrategiesPage = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/strategies/get/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch strategies");
      }

      const result = await response.json();
      setStrategies(result.strategies);
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

  const handleToggleStatus = async (strategyId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/${strategyId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle strategy status");
      }

      setStrategies((prevStrategies) =>
        prevStrategies.map((strategy) =>
          strategy._id === strategyId
            ? { ...strategy, status: !currentStatus }
            : strategy
        )
      );

      toast({
        title: "Success",
        description: `Strategy ${currentStatus ? "disabled" : "enabled"} successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/strategies/delete/${selectedStrategyId}`,
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

      setStrategies((prevStrategies) =>
        prevStrategies.filter((strategy) => strategy._id !== selectedStrategyId)
      );

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
      setDeleteDialogOpen(false);
      setSelectedStrategyId(null);
    }
  };

  const handleStrategyUpdate = (updatedStrategy) => {
    setStrategies((prevStrategies) =>
      prevStrategies.map((strategy) =>
        strategy._id === updatedStrategy._id ? updatedStrategy : strategy
      )
    );
  };

  const handleStrategyDelete = (deletedStrategyId) => {
    setStrategies((prevStrategies) =>
      prevStrategies.filter((strategy) => strategy._id !== deletedStrategyId)
    );
  };

  // Filter strategies based on the search query
  const filteredStrategies = strategies.filter((strategy) =>
    strategy.strategyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
          <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Strategies</h1>
  <div className="flex items-center gap-4">
    <input
      type="text"
      className="p-2 border rounded-md w-64" // Adjust width as needed
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Button
      onClick={() => (window.location.href = "/dashboard/new-strategy")}
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> New Strategy
    </Button>
  </div>
</div>


            {isLoading ? (
              <div className="text-center py-4">Loading strategies...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Strategy Name</th>
                      <th className="py-3 px-4 text-left">Created At</th>
                      <th className="py-3 px-4 text-left">Updated At</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStrategies.map((strategy) => (
                      <tr key={strategy._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{strategy.strategyName}</td>
                        <td className="py-3 px-4">
                          {new Date(strategy.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(strategy.updatedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={strategy.status}
                              onCheckedChange={() =>
                                handleToggleStatus(strategy._id, strategy.status)
                              }
                            />
                            <span
                              className={
                                strategy.status ? "text-green-600" : "text-gray-500"
                              }
                            >
                              {strategy.status ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <StrategyDialog
                              strategyId={strategy._id}
                              onUpdate={handleStrategyUpdate}
                              onDelete={handleStrategyDelete}
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                setSelectedStrategyId(strategy._id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this strategy? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StrategiesPage;

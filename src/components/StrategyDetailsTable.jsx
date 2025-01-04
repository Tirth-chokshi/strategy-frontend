"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const StrategyDetailsTable = ({ details, isEditing, handleInputChange, handleTypeChange, handleDeleteDetail }) => (
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
export default StrategyDetailsTable  
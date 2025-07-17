"use client";

import { Category } from "@/Types";
import React from "react";
import { Button } from "./ui/button";

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  allCount: number;
  completedCount: number;
  incompleteCount: number;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange, allCount, completedCount, incompleteCount }) => {
  return (
    <div className="flex space-x-4 mb-8 border-b border-gray-200">
      <Button variant={activeCategory === "all" ? "default" : "ghost"} onClick={() => onCategoryChange("all")} className={activeCategory === "all" ? "text-purple-600" : "text-gray-600"}>
        All ({allCount})
      </Button>
      <Button variant={activeCategory === "completed" ? "default" : "ghost"} onClick={() => onCategoryChange("completed")} className={activeCategory === "completed" ? "text-purple-600" : "text-gray-600"}>
        Completed ({completedCount})
      </Button>
      <Button variant={activeCategory === "incomplete" ? "default" : "ghost"} onClick={() => onCategoryChange("incomplete")} className={activeCategory === "incomplete" ? "text-purple-600" : "text-gray-600"}>
        Incomplete ({incompleteCount})
      </Button>
    </div>
  );
};

export default CategoryTabs;

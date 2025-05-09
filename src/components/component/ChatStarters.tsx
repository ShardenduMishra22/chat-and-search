"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";
import { CONVERSATION_STARTERS } from "./Chat";

interface ChatStartersProps {
  onSelectStarter: (starter: string) => void;
}

export const ChatStarters = ({ onSelectStarter }: ChatStartersProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Categories for starters (optional)
  const categories = [
    { name: "Popular", starters: CONVERSATION_STARTERS.slice(0, 4) },
    { name: "Creative", starters: CONVERSATION_STARTERS.slice(4) },
  ];

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-3xl mx-auto px-4 py-8 mb-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 mb-6"
      >
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Get started with a suggestion
        </h2>
      </motion.div>

      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <motion.h3
              variants={itemVariants}
              className="text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {category.name}
            </motion.h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.starters.map((starter, index) => {
                const globalIndex = categoryIndex * 4 + index;
                return (
                  <motion.div
                    key={globalIndex}
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative"
                  >
                    <Button
                      variant="outline"
                      onClick={() => onSelectStarter(starter)}
                      className={`w-full justify-between text-left font-normal h-auto py-3 px-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 ${
                        hoveredIndex === globalIndex
                          ? "border-blue-300 dark:border-blue-500 shadow-sm"
                          : ""
                      }`}
                    >
                      <span className="line-clamp-2">{starter}</span>
                      <ChevronRight
                        className={`h-4 w-4 ml-2 flex-shrink-0 transition-transform duration-200 ${
                          hoveredIndex === globalIndex
                            ? "text-blue-500 translate-x-1"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <motion.p
        variants={itemVariants}
        className="text-xs text-center text-gray-500 dark:text-gray-400 mt-8"
      >
        Or type your own question below to get started
      </motion.p>
    </motion.div>
  );
};
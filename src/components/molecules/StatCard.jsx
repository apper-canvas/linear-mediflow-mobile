import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, change, icon, trend = "up", color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary to-primary-700",
    secondary: "from-secondary to-secondary-700",
    accent: "from-accent to-green-600",
    warning: "from-warning to-yellow-600",
    error: "from-error to-red-600"
  };

  const trendColor = trend === "up" ? "text-accent" : "text-error";
  const trendIcon = trend === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                <ApperIcon name={trendIcon} className={`w-4 h-4 ${trendColor}`} />
                <span className={`text-sm font-medium ${trendColor}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Card>
  );
};

export default StatCard;
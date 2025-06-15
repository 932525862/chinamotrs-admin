export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    case "low_stock":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "out_of_stock":
      return "Out of Stock";
    case "low_stock":
      return "Low Stock";
    default:
      return status;
  }
};

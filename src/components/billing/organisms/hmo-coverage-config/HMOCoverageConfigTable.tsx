import { useState, useMemo } from "react";
import { Search, Shield, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HMOCoverageConfigRow } from "@/components/billing/molecules/hmo/HMOCoverageConfigRow";
import { HMOCoverageTypeBadge } from "@/components/atoms/display/HMOCoverageTypeBadge";
import { QueuePagination } from "@/components/molecules/queue/QueuePagination";
import {
  HMOServiceCoverage,
  HMOCoverageType,
  ServiceCategory,
  HMOProvider,
} from "@/types/billing.types";
import {
  getAllCoveragesPaginated,
  updateCoverage,
} from "@/data/hmo-service-coverage";
import { useHMOProviders } from "@/hooks/queries/useClaimQueries";

const CATEGORIES: { value: ServiceCategory | "All"; label: string }[] = [
  { value: "All", label: "All Categories" },
  { value: "consultation", label: "Consultation" },
  { value: "lab", label: "Laboratory" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "procedure", label: "Procedure" },
  { value: "other", label: "Other" },
];

export function HMOCoverageConfigTable() {
  const { data: hmoProviders = [] } = useHMOProviders();
  const typedHMOProviders = hmoProviders as HMOProvider[];

  const [selectedProvider, setSelectedProvider] = useState<string>(
    typedHMOProviders[0]?.id || "",
  );
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter coverages based on selected provider, category, and search query
  const filteredCoverages = useMemo(() => {
    const allCoverages = getAllCoveragesPaginated(1, 1000).data;

    return allCoverages.filter((coverage) => {
      const matchesProvider = coverage.hmoProviderId === selectedProvider;
      const matchesCategory =
        categoryFilter === "All" || coverage.serviceCategory === categoryFilter;
      const matchesSearch =
        searchQuery === "" ||
        coverage.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesProvider && matchesCategory && matchesSearch;
    });
  }, [selectedProvider, categoryFilter, searchQuery]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCoverages.slice(startIndex, endIndex);
  }, [filteredCoverages, currentPage]);

  const totalPages = Math.ceil(filteredCoverages.length / pageSize);

  const handleUpdateCoverage = (
    id: string,
    updatedCoverage: HMOServiceCoverage,
  ): void => {
    updateCoverage(updatedCoverage.id, updatedCoverage);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const selectedProviderName =
    typedHMOProviders.find((p) => p.id === selectedProvider)?.name || "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>HMO Service Coverage Configuration</CardTitle>
            </div>
            <Badge variant="outline" className="gap-1">
              <Filter className="h-3 w-3" />
              {filteredCoverages.length} Services
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Provider Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                HMO Provider
              </label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {typedHMOProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Service Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as ServiceCategory | "All")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search Service
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by service name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Coverage Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Pre-Auth</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No services found for {selectedProviderName}
                      {categoryFilter !== "All" && ` in ${categoryFilter}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((coverage) => (
                    <HMOCoverageConfigRow
                      key={coverage.id}
                      coverage={coverage}
                      onUpdate={handleUpdateCoverage}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <QueuePagination
                totalItems={totalPages}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { ChevronDown, Printer, RefreshCw, Send, Edit, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

interface LabQuickActionsDropdownProps {
  userRole: string;
  labOrderStatus: string;
  isSubmittedToDoctor: boolean;
  isHmoPatient: boolean;
  hasActiveEpisodes: boolean;
  onPrintResults: () => void;
  onRequestRetest: () => void;
  onForwardToSpecialist: () => void;
  onAddToEpisode: () => void;
  onEditResults: () => void;
}

export function LabQuickActionsDropdown({
  userRole,
  labOrderStatus,
  isSubmittedToDoctor,
  isHmoPatient,
  hasActiveEpisodes,
  onPrintResults,
  onRequestRetest,
  onForwardToSpecialist,
  onAddToEpisode,
  onEditResults,
}: LabQuickActionsDropdownProps) {
  const isDoctorOrLead = userRole === 'doctor' || userRole === 'clinical_lead';
  const isLabTech = userRole === 'lab_tech';
  const canEditResults = isLabTech && labOrderStatus === 'completed' && !isSubmittedToDoctor;

  const hasReviewActions = isDoctorOrLead;
  const hasLabActions = isLabTech;

  if (!hasReviewActions && !hasLabActions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Quick Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {hasReviewActions && (
          <>
            <DropdownMenuLabel>Review</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onPrintResults}>
                <Printer className="mr-2 h-4 w-4" />
                Print Results
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRequestRetest}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Request Retest
              </DropdownMenuItem>
              {userRole === 'clinical_lead' && (
                <DropdownMenuItem onClick={onForwardToSpecialist}>
                  <Send className="mr-2 h-4 w-4" />
                  Forward to Specialist
                </DropdownMenuItem>
              )}
              {isHmoPatient && hasActiveEpisodes && (
                <DropdownMenuItem onClick={onAddToEpisode}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add to Episode
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}

        {hasReviewActions && hasLabActions && <DropdownMenuSeparator />}

        {hasLabActions && (
          <>
            <DropdownMenuLabel>Lab Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              {canEditResults && (
                <DropdownMenuItem onClick={onEditResults}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Results
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onPrintResults}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

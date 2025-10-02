import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface SimplePaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (newPage: number) => void;
}

export function SimplePagination({ page, pageSize, totalCount, onPageChange }: SimplePaginationProps) {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Próximo
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
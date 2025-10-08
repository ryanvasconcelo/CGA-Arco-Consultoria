import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/services/userService';
import { AuditLog } from '@/services/auditService';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthorNameProps {
  log: AuditLog;
}

// Função síncrona para uma primeira tentativa de encontrar o nome
const getInitialAuthorName = (log: AuditLog): string | null => {
    if (log.author?.name) return log.author.name;
    if (log.details?.authorName) return log.details.authorName;
    if (log.details?.userName) return log.details.userName;
    return null;
};

export const AuthorName = ({ log }: AuthorNameProps) => {
  const initialName = getInitialAuthorName(log);
  const authorId = log.author?.id;

  // A query só é ativada se não encontrarmos um nome inicial e se houver um ID de autor.
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', authorId],
    queryFn: () => fetchUserById(authorId!),
    enabled: !initialName && !!authorId,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    retry: 1, // Tenta apenas 1 vez em caso de erro
  });

  if (initialName) {
    return <>{initialName}</>;
  }

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  if (user) {
    return <>{user.name}</>;
  }

  // Se tudo falhar, retorna 'Sistema'
  return <>Sistema</>;
};
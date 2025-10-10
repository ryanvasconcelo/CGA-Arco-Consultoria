import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error('Token inválido');
            navigate('/login');
        }
    }, [token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email) {
            setError('O email é obrigatório.');
            toast.error('Email obrigatório', {
                description: 'Por favor, digite seu email para verificação.'
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            toast.error('Senhas não coincidem', {
                description: 'A nova senha e a confirmação devem ser iguais.'
            });
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            toast.error('Senha muito curta', {
                description: 'A senha deve ter no mínimo 6 caracteres.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`/password/reset/${token}`, {
                email: formData.email,
                password: formData.password,
            });

            setIsSuccess(true);
            toast.success('Senha redefinida com sucesso!');

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err: any) {
            console.error('Erro ao redefinir senha:', err);
            const errorMessage = err.response?.data?.error || 'Token inválido ou expirado.';
            setError(errorMessage);
            toast.error('Falha ao redefinir senha', { description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
                <Card className="w-full max-w-md glass-card border-white/10">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-500/20 p-3">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold">Senha Redefinida!</h2>
                            <p className="text-muted-foreground">
                                Sua senha foi alterada com sucesso. Redirecionando para o login...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
            <Card className="w-full max-w-md glass-card border-white/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                        Criar Nova Senha
                    </CardTitle>
                    <CardDescription>
                        Digite sua nova senha abaixo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email de Verificação</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Digite seu email"
                                autoComplete="email"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Digite seu email para confirmar sua identidade
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10"
                                    placeholder="Digite sua nova senha"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pl-10"
                                    placeholder="Confirme sua nova senha"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full gradient-primary hover-lift"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Nova Senha
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
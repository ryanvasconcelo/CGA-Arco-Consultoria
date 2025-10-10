import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Save, Loader2 } from 'lucide-react';

export default function ForceResetPassword() {
    const navigate = useNavigate();
    const [tempToken, setTempToken] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Recupera o token e senha temporários do sessionStorage
        const storedToken = sessionStorage.getItem('@CGA:tempToken');
        const storedPassword = sessionStorage.getItem('@CGA:tempPassword');
        const storedEmail = sessionStorage.getItem('@CGA:userEmail');

        console.log('🔍 Debug - Token recuperado:', storedToken);
        console.log('🔍 Debug - Senha recuperada:', storedPassword ? '***' : 'null');
        console.log('🔍 Debug - Email recuperado:', storedEmail);

        if (!storedToken || !storedPassword || !storedEmail) {
            console.log('❌ Dados não encontrados, redirecionando para login');
            navigate('/login');
            return;
        }

        setTempToken(storedToken);
        setTempPassword(storedPassword);
        setUserEmail(storedEmail);
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Verifica se o email corresponde
        if (formData.email.toLowerCase() !== userEmail.toLowerCase()) {
            setError('O email não corresponde ao email cadastrado.');
            toast.error('Email incorreto', {
                description: 'Por favor, digite o email da sua conta.'
            });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('As novas senhas não coincidem.');
            toast.error('Senhas não coincidem', {
                description: 'A nova senha e a confirmação devem ser iguais.'
            });
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            toast.error('Senha muito curta', {
                description: 'A senha deve ter no mínimo 6 caracteres.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('🔐 Tentando mudar senha...');
            console.log('🔑 Token sendo usado:', tempToken);
            console.log('📝 Payload:', { oldPassword: '***', newPassword: '***' });

            // Cria uma instância axios temporária com o token
            const apiWithToken = axios.create({
                baseURL: import.meta.env.VITE_API_BASE_URL,
                headers: {
                    'Authorization': `Bearer ${tempToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Usa o token temporário para alterar a senha
            const response = await apiWithToken.post('/users/me/change-password', {
                oldPassword: tempPassword,
                newPassword: formData.newPassword,
            });

            console.log('✅ Resposta do servidor:', response.data);

            toast.success('Senha alterada com sucesso! Por favor, faça login com sua nova senha.');

            // Limpa as credenciais temporárias
            sessionStorage.removeItem('@CGA:tempToken');
            sessionStorage.removeItem('@CGA:tempPassword');

            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            console.error('❌ Erro ao mudar senha:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.error || 'Ocorreu um erro ao alterar a senha.';
            setError(errorMessage);
            toast.error('Falha ao alterar senha', { description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
            <Card className="w-full max-w-md glass-card border-white/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                        Redefinição de Senha Obrigatória
                    </CardTitle>
                    <CardDescription>
                        Por segurança, você precisa criar uma nova senha para seu primeiro acesso.
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
                                placeholder="Confirme seu email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Digite o email da sua conta para confirmar sua identidade
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full gradient-primary hover-lift" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Nova Senha
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
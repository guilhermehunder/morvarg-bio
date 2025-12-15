
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            toast({
                title: 'E-mail Enviado!',
                description: 'Verifique sua caixa de entrada para resetar sua senha.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erro ao Enviar E-mail',
                description: error.message || 'Verifique se o e-mail está correto.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm bg-black/80 border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Recuperar Senha
                    </CardTitle>
                    <CardDescription>
                        {emailSent
                            ? 'E-mail de recuperação enviado com sucesso!'
                            : 'Digite seu e-mail para receber um link de recuperação.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!emailSent ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-900/50 border-gray-700 text-white"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-sm text-green-400">
                                    ✓ Um e-mail foi enviado para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push('/admin/login')}
                                className="w-full bg-primary hover:bg-primary/90"
                            >
                                Voltar ao Login
                            </Button>
                        </div>
                    )}

                    <div className="mt-4 text-center text-sm">
                        <Link href="/admin/login" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary underline">
                            <ArrowLeft className="h-3 w-3" />
                            Voltar ao Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

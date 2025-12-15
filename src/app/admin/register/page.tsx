
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore, useMemoFirebase, errorEmitter } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationLocked, setRegistrationLocked] = useState<boolean | null>(null);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const settingsDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'admin') : null, [firestore]);

  useEffect(() => {
    if (isUserLoading) return;
    if (user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!settingsDocRef) return;

    const checkRegistrationStatus = async () => {
      try {
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists() && docSnap.data().registrationLocked) {
          setRegistrationLocked(true);
          toast({
            variant: 'destructive',
            title: 'Registration Locked',
            description: 'An admin account already exists. Please log in.',
          });
          router.push('/admin/login');
        } else {
          setRegistrationLocked(false);
        }
      } catch (e) {
        // This is likely a permission error on the initial check.
        // We will emit it for debugging but allow the UI to proceed as if registration is open.
        const permissionError = new FirestorePermissionError({
          path: settingsDocRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        // Assume registration is not locked if we can't read the doc.
        setRegistrationLocked(false); 
      }
    };

    checkRegistrationStatus();
  }, [settingsDocRef, router, toast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationLocked) return;

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const registrationData = { 
        email: userCredential.user.email,
        registrationLocked: true,
        allowedInvites: [],
      };

      // Lock registration - use non-blocking write with error handling
      setDoc(settingsDocRef!, registrationData)
        .then(() => {
          toast({
            title: 'Registration Successful',
            description: 'Redirecting to admin panel...',
          });
          router.push('/admin');
        })
        .catch(error => {
          const permissionError = new FirestorePermissionError({
            path: settingsDocRef!.path,
            operation: 'create',
            requestResourceData: registrationData
          });
          errorEmitter.emit('permission-error', permissionError);
          // Also show a user-facing error
          setError('Failed to lock registration. Please contact support.');
          toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'Could not save admin settings.',
          });
        });

    } catch (error: any) {
      setError(error.message);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message,
      });
      setIsLoading(false); // Only set loading to false here on initial user creation failure
    } 
    // Don't set isLoading to false here, as we are navigating away on success
  };

  if (isUserLoading || user || registrationLocked === null) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (registrationLocked) {
     return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Registration is locked. Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-black/80 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>This will be the one and only admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/admin/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

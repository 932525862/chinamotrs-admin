import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';


const loginSchema = z.object({
    phone_number: z
        .string()
        .min(6, 'Phone number must be at least 6 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, user, isLoading } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        console.log(`Type of phone_number : ${typeof data.phone_number}, Type of password : ${typeof data.password}`,);
        const success = await login(Number(data.phone_number), String(data.password));

        if (!success) {
            toast.error('Invalid credentials. Use admin@example.com / password');
            return;
        }

        toast.success('Login successful', {
            duration: 2000,
            position: 'top-right',
        });

        // navigate("/dashboard");

        console.log(success, "Success from login");

        return success;

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-2xl font-bold">A</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
                    <CardDescription className="text-gray-600">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone Number : </Label>
                            <Input
                                id="phone_number"
                                type="tel"
                                placeholder="931004027"
                                value={Number(931004027)}
                                {...register('phone_number')}
                                className={errors.phone_number ? 'border-red-500' : ''}
                            />
                            {errors.phone_number && (
                                <p className="text-sm text-red-500">{errors.phone_number.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password')}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Demo credentials:</p>
                        <p className="font-mono bg-gray-50 p-2 rounded mt-2">
                            phone_number: {user?.phone_number} <br />
                            password: {user?.password}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
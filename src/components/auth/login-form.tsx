import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    phoneNumber: z
        .string()
        .min(7, 'Phone number must be 7 digits')
        .regex(/^\d{9}$/, 'Enter 9 digits like 901234567'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        // reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phoneNumber: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        clearError();

        const formattedPhone = `+998${data.phoneNumber}`; // ✅ attach +998

        try {
            const success = await login(formattedPhone, data.password);

            if (success) {
                toast.success('Login successful! Welcome back.', {
                    duration: 3000,
                    position: 'top-right',
                });
                navigate("/dashboard/news");
            } else {
                toast.error(error || 'Login failed. Please check your credentials.', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } catch (err: any) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred. Please try again.',
                { duration: 4000, position: 'top-right' }
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 pb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <LogIn className="text-white text-2xl" size={28} />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                            Sign in to access your dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-base text-black font-normal">
                                    +998
                                </span>


                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={9}
                                    placeholder="901234567"
                                    {...register('phoneNumber')}
                                    className={`pl-14 tracking-wider ${errors.phoneNumber
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : 'border-gray-200 focus-visible:ring-blue-500'
                                        }`}
                                />
                            </div>
                            {errors.phoneNumber && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password')}
                                    className={`pr-12 ${errors.password
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : 'border-gray-200 focus-visible:ring-blue-500'
                                        }`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import ImageCropDialog from '@/components/image-crop-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [backgroundCropDialogOpen, setBackgroundCropDialogOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { data, setData, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        birthdate: auth.user.birthdate || '',
        profile_picture: null as File | null,
        background_picture: null as File | null,
    });

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImageSrc(reader.result as string);
                setCropDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackgroundPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImageSrc(reader.result as string);
                setBackgroundCropDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileCropComplete = (croppedImageBlob: Blob) => {
        const file = new File([croppedImageBlob], 'profile.jpg', { type: 'image/jpeg' });
        setData('profile_picture', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(croppedImageBlob);
    };

    const handleBackgroundCropComplete = (croppedImageBlob: Blob) => {
        const file = new File([croppedImageBlob], 'background.jpg', { type: 'image/jpeg' });
        setData('background_picture', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setBackgroundPreview(reader.result as string);
        };
        reader.readAsDataURL(croppedImageBlob);
    };

    const removePicture = (type: 'profile' | 'background') => {
        router.delete(route('profile.remove-picture', { type }), {
            preserveScroll: true,
            onSuccess: () => {
                if (type === 'profile') {
                    setProfilePreview(null);
                    setData('profile_picture', null);
                } else {
                    setBackgroundPreview(null);
                    setData('background_picture', null);
                }
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Create a new form with only the necessary data
        const formData = new FormData();
        formData.append('name', data.name || '');
        formData.append('email', data.email || '');
        formData.append('birthdate', data.birthdate || '');
        formData.append('_method', 'PATCH'); // Laravel method spoofing

        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture);
        }
        if (data.background_picture) {
            formData.append('background_picture', data.background_picture);
        }

        // Debug: Log what we're sending
        console.log('Submitting form data:', {
            name: data.name,
            email: data.email,
            birthdate: data.birthdate,
            hasProfilePicture: !!data.profile_picture,
            hasBackgroundPicture: !!data.background_picture,
        });

        router.post(route('profile.update'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 2000);
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.log('Form submission errors:', errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile Settings" description="Manage your profile information, pictures, and personal details" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="space-y-4">
                            <HeadingSmall title="Profile Picture" description="Upload or change your profile picture" />

                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={profilePreview || (auth.user.profile_picture ? `/storage/${auth.user.profile_picture}` : undefined)}
                                            alt={auth.user.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-lg">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <input
                                            id="profile_picture"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="sr-only"
                                        />
                                        <label htmlFor="profile_picture" className="cursor-pointer">
                                            <Button type="button" variant="outline" size="sm" asChild>
                                                <span>Upload Picture</span>
                                            </Button>
                                        </label>
                                    </div>
                                    {(auth.user.profile_picture || profilePreview) && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removePicture('profile')}
                                        >
                                            Remove Picture
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <InputError className="mt-2" message={errors.profile_picture} />
                        </div>

                        {/* Background Picture Section */}
                        <div className="space-y-4">
                            <HeadingSmall title="Background Picture" description="Upload or change your background picture" />

                            <div className="space-y-4">
                                {(backgroundPreview || auth.user.background_picture) && (
                                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted border">
                                        <img
                                            src={backgroundPreview || `/storage/${auth.user.background_picture}`}
                                            alt="Background preview"
                                            className="h-full w-full object-cover object-center"
                                            style={{ imageRendering: 'crisp-edges' }}
                                        />
                                    </div>
                                )}

                                <div className="flex space-x-2">
                                    <div>
                                        <input
                                            id="background_picture"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBackgroundPictureChange}
                                            className="sr-only"
                                        />
                                        <label htmlFor="background_picture" className="cursor-pointer">
                                            <Button type="button" variant="outline" size="sm" asChild>
                                                <span>Upload Background</span>
                                            </Button>
                                        </label>
                                    </div>
                                    {(auth.user.background_picture || backgroundPreview) && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removePicture('background')}
                                        >
                                            Remove Background
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <InputError className="mt-2" message={errors.background_picture} />
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <HeadingSmall title="Personal Information" description="Update your personal details" />

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birthdate">Birthdate</Label>
                                    <Input
                                        id="birthdate"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.birthdate}
                                        onChange={(e) => setData('birthdate', e.target.value)}
                                        placeholder="Your birthdate"
                                        disabled={!!auth.user.birthdate}
                                    />
                                    {auth.user.birthdate && (
                                        <p className="text-sm text-muted-foreground">
                                            Birthdate cannot be changed once set for security reasons.
                                        </p>
                                    )}
                                    <InputError className="mt-2" message={errors.birthdate} />
                                </div>
                            </div>
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={isProcessing}>Save Changes</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* Image Crop Dialogs */}
                <ImageCropDialog
                    isOpen={cropDialogOpen}
                    onClose={() => setCropDialogOpen(false)}
                    imageSrc={tempImageSrc}
                    onCropComplete={handleProfileCropComplete}
                    aspectRatio={1} // Square crop for profile pictures
                    title="Crop Profile Picture"
                />

                <ImageCropDialog
                    isOpen={backgroundCropDialogOpen}
                    onClose={() => setBackgroundCropDialogOpen(false)}
                    imageSrc={tempImageSrc}
                    onCropComplete={handleBackgroundCropComplete}
                    aspectRatio={16 / 9} // Wide crop for background pictures
                    title="Crop Background Picture"
                />

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

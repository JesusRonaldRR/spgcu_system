import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="nombres" value="Nombres" />

                    <TextInput
                        id="nombres"
                        name="nombres"
                        value={data.nombres}
                        className="mt-1 block w-full"
                        autoComplete="given-name"
                        isFocused={true}
                        onChange={(e) => setData('nombres', e.target.value)}
                        required
                    />

                    <InputError message={errors.nombres} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="apellidos" value="Apellidos" />

                    <TextInput
                        id="apellidos"
                        name="apellidos"
                        value={data.apellidos}
                        className="mt-1 block w-full"
                        autoComplete="family-name"
                        onChange={(e) => setData('apellidos', e.target.value)}
                        required
                    />

                    <InputError message={errors.apellidos} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="dni" value="DNI" />

                    <TextInput
                        id="dni"
                        name="dni"
                        type="text"
                        value={data.dni}
                        className="mt-1 block w-full"
                        autoComplete="off"
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                            setData('dni', val);
                        }}
                        required
                    />

                    <InputError message={errors.dni} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignInForm() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
        const data = await fetch(import.meta.env.VITE_API_URL + "/user/sign-in", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }).then(response => response.json());
        localStorage.setItem("refresh-token", data.refreshToken);
        localStorage.setItem("access-token", data.accessToken);
    }

    return (
        <form style={{width: "80%"}} onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={3} isInvalid={!!errors.email}>
                <FormLabel mb={0}>Email address</FormLabel>
                <Input
                    type='email'
                    id='email'
                    {...register(
                        'email',
                        {
                            required: 'Email is required',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please enter a valid email',
                            }
                        }
                    )}
                />
                <FormErrorMessage mt={1}>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
                <FormLabel mb={0}>Password</FormLabel>
                <Input
                    type='password'
                    id='password'
                    {...register('password', {
                        required: {
                            value: true,
                            message: 'Password is required',
                        },
                        minLength: {
                            value: 6,
                            message: 'This field has a minimum length of 6',
                        },
                    })}
                />
                <FormErrorMessage mt={1}>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button type='submit' mt={4} width="100%" colorScheme='teal'>
                Sign in
            </Button>
        </form>
    )
}
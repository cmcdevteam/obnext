'use client'

import { useState } from 'react'
import { isEmpty } from 'lodash'
import validateAndSanitizeLoginForm from './validation'
import { v4 } from 'uuid'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

export default function Login({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    
    const router = useRouter()
	const [ loginFields, setLoginFields ] = useState( {
		username: '',
		password: '',
	} )
	const [ errorMessage, setErrorMessage ] = useState( null )
	const [ loading, setLoading ] = useState( false )

	const onFormSubmit = async (event) => {
		event.preventDefault()
		setErrorMessage( null )
		const {postType, postId} = searchParams ?? {}

		// Validation and Sanitization.
		const validationResult = validateAndSanitizeLoginForm( {
			username: loginFields?.username ?? '',
			password: loginFields?.password ?? '',
		} )

		if ( validationResult.isValid ) {
			setLoading( true )

            const res = await fetch( "http://headless.local/graphql", 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `mutation WPLogin ( $input: LoginInput!) {
                                    login(input: $input) {
                                        authToken
                                    }
                                }`,
                        variables: {
                            input: {
                                clientMutationId: v4(), // Generate a unique id
                                username: username,
                                password: password
                            }
			            }
                    })
                })

            const fetchedData = await res.json()
            setLoading(false)

            if(fetchedData.data?.login?.authToken) {
                setCookie("authToken", fetchedData.data.login.authToken, )
                
                if(postType === "post") {
                    router.push(`/api/preview/blog/${postId}`)
                } else {
                    //router.push(`/api/preview/page/${postId})
                }
                
            } else {
                setErrorMessage(fetchedData.errors[0].message)
            }

		} else {
            setLoading(false)
			setClientSideError( validationResult );
		}
	}

	/**
     * Sets client side error.
     *
     * Sets error data to result received from our client side validation function,
     * and statusbar to true so that its visible to show the error.
     *
     * @param {Object} validationResult Validation Data result.
     */
	const setClientSideError = ( validationResult ) => {
		if ( validationResult.errors.password ) {
			setErrorMessage( validationResult.errors.password );
		}

		if ( validationResult.errors.username ) {
			setErrorMessage( validationResult.errors.username );
		}
	};

	const handleOnChange = ( event ) => {
		setLoginFields( { ...loginFields, [event.target.name]: event.target.value } )
	}

	const { username, password } = loginFields

	return (
		<section className="pt-20">
			<div className="login-form bg-gray-100 rounded-lg p-8 md:ml-auto w-5/12 m-auto">
				<h4 className="text-gray-900 text-lg font-medium title-font mb-5 block">Login</h4>
				{! isEmpty( errorMessage ) && (
					<div className="text-red-600">{errorMessage}</div>
				)}
				<form onSubmit={onFormSubmit} className="mb-4">
					<label className="leading-7 text-sm text-gray-600">
                    Username:
						<input
							type="text"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							name="username"
							value={username}
							onChange={handleOnChange}
						/>
					</label>
					<br />
					<label className="leading-7 text-sm text-gray-600">
                    Password:
						<input
							type="password"
							className="mb-8 w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							name="password"
							value={password}
							onChange={handleOnChange}
						/>
					</label>
					<button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="submit">
                    Login
					</button>
					{loading ? <p>Loading...</p> : null  }
				</form>
			</div>
		</section>
	);
}
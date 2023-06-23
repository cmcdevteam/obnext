import './globals.css'
import NavBar from './components/navbar'
//import LoginProvider from './api/preview/login-provider'

export const metadata = {
  	title: 'Oliver Burns',
  	description: 'Thoughtfully designing and building the world\'s finest homes.',
}

export default async function RootLayout({
  	children,
}: {
  	children: React.ReactNode
}) {

  	const res = await fetch( process.env.GRAPHQL_API_URL, 
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `query getMenuItems {
							menuItems(where: {location: HCMS_MENU_HEADER}) {
								edges {
									node {
										id
										label
										url
										path
									}
								}
							},
						}`
			}),
			next: { revalidate: 10 },
		}
	).then((res) => res.json())

	const menuItems = res?.data?.menuItems?.edges
	const length = menuItems.length
	const midIndex = Math.ceil(length / 2)
	const leftMenuItems: Array<any> = menuItems.slice(0, midIndex)
	const rightMenuItems: Array<any> = menuItems.slice(midIndex, length)

  	return (
		<html lang="en">
			<body>
			
				<NavBar mid={midIndex} leftmenu={leftMenuItems} rightmenu={rightMenuItems} />
				<main className="mt-24 md:mt-48 lg:mt-24">
					{children}
				</main>
			
			</body>
		</html>
  	)
}

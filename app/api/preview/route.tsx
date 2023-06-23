import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
 
export async function GET(request: Request) {
    // http://localhost:3001/api/preview?postType=post&postId=23925
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const postType = searchParams.get('postType')
    const cookieStore = cookies()
    const authToken = cookieStore.get('authToken')

    if(authToken === undefined) {
        redirect(`/login?postType=${postType}&postId=${postId}`)
    } else {
        if(postType === 'post') {
            redirect(`/api/preview/blog/${postId}`)
        } else {
            //redirect(`/api/preview/page/${postId}`)
        }
    }
}
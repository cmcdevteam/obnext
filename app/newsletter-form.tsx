
export default function NewsletterForm() {

    async function subscribe(data: FormData) {
        'use server'
        
        const base64ApiKey = Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString("base64")
        const body = {
            email_address: data.get('email') as string,
            status: "subscribed",
        }

        try {
            const response = await fetch( process.env.MAILCHIMP_URL, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${base64ApiKey}`,
                    },
                    body: JSON.stringify(body)
                })
                .then((res) => (
                    res.json()
                ))
                console.log('response', response)

                if(response.status === 200) {
                    const msg = 'Thank you for signing up. We will not share your information and you can unsubscribe at any time you wish.'
                } else if(response.status === 400) {

                }
                
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <>
        <div className="py-5 px-5 max-w-3xl mx-auto">
            <h6 className="text-[#581F5B] text-lg text-center py-10">OB NEWSLETTER</h6>
            <p className="pb-8 text-center text-[#BA995C] text-3xl">Be the first to hear about our super-prime projects.</p>
            
            <form action={subscribe} className="relative">
                <input type="email" name="email" className="w-[calc(100%_-_120px)] border-b border-[#BA995C] text-[#BA995C] text-sm" placeholder="Email Address" required />
                <button type="submit" className="absolute right-0 -top-px border border-[#BA995C] text-[#BA995C] py-2.5 px-5">SUBMIT</button>
            </form>
            <div id="mc-RESPONSE"></div>
        </div>
        </>
    )
}